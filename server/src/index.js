require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("./workers/readmeWorker");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/github", require("./routes/github"));
app.use("/webhook", require("./routes/webhook"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "RepoScribe API",
  });
});

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 RepoScribe server running on port ${PORT}`);
});
