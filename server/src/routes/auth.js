const router = require("express").Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// STEP 1 → Redirect user to GitHub
router.get("/github", (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
  res.redirect(url);
});

// STEP 2 → GitHub sends code back
router.get("/github/callback", async (req, res) => {
  try {
    const { code } = req.query;

    // exchange code for token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );

    const accessToken = tokenRes.data.access_token;

    // fetch user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userRes.data;

    // find or create user
    let user = await User.findOne({ githubId: githubUser.id });

    if (!user) {
      user = await User.create({
        githubId: githubUser.id,
        username: githubUser.login,
        avatar: githubUser.avatar_url,
        accessToken,
      });
    }

    // create jwt
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token: jwtToken });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "OAuth failed" });
  }
});

module.exports = router;
