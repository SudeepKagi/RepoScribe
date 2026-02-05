require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const session = require("express-session");
const cors = require("cors");
const axios = require("axios");
const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Database Connection
console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Queue Connection
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

const readmeQueue = new Queue("readme-queue", { connection: redisConnection });

// User Setup
const UserSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  accessToken: String,
  avatarUrl: String
});
const User = mongoose.model("User", UserSchema);

// Setup
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Logic
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      
      const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

      if (!user) {
        user = await new User({
          githubId: profile.id,
          username: profile.username,
          accessToken: accessToken,
          avatarUrl: photo
        }).save();
      } else {
        user.accessToken = accessToken;
        user.avatarUrl = photo;
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email", "repo"] }));

app.get("/auth/github/callback", 
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    console.log("Redirecting to Dashboard...");
    res.redirect("http://localhost:5173");
  }
);

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1> Phase 2 Complete!</h1><p>Welcome, <b>${req.user.username}</b>.</p><p>You are logged in.</p>`);
  } else {
    res.send(`<h1> Not Logged In</h1><a href="/auth/github">Login with GitHub</a>`);
  }
});



app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

app.get("/api/user", (req, res) => {
  res.json(req.user || null);
});

// Fetch Repositories from GitHub
app.get("/api/repos", async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not logged in" });

  try {
    const response = await axios.get("https://api.github.com/user/repos?sort=updated&visibility=public", {
      headers: {
        Authorization: `token ${req.user.accessToken}`,
        Accept: "application/vnd.github.v3+json"
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error("GitHub API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
});

// Trigger a manual generation job
app.post("/api/activate", async (req, res) => {
  const { repoName } = req.body;
  
  console.log(`🔔 Queuing job for: ${repoName}`);
  
  await readmeQueue.add("generate-readme", {
    repoName: repoName,
    userName: req.user.username,
    accessToken: req.user.accessToken
  });

  res.json({ message: "Job Queued", status: "processing" });
});
// Start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});