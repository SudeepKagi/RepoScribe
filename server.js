require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const session = require("express-session");
const cors = require("cors");

const app = express();

// Database Connection
console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// User Setup
const UserSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  accessToken: String
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
    console.log(" GitHub Login Successful for:", profile.username);
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        console.log("Creating new user in DB...");
        user = await new User({
          githubId: profile.id,
          username: profile.username,
          accessToken: accessToken
        }).save();
      }
      return done(null, user);
    } catch (err) {
      console.error("DB Error during login:", err);
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
    res.redirect("/dashboard");
  }
);

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1> Phase 2 Complete!</h1><p>Welcome, <b>${req.user.username}</b>.</p><p>You are logged in.</p>`);
  } else {
    res.send(`<h1> Not Logged In</h1><a href="/auth/github">Login with GitHub</a>`);
  }
});

// Start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});