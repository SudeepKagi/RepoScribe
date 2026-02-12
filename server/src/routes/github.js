const router = require("express").Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Repo = require("../models/Repo");

// Get all repositories of logged in user
router.get("/repos", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    const repos = response.data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      default_branch: repo.default_branch,
    }));

    res.json(repos);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
});

// Activate repository
router.post("/activate", authMiddleware, async (req, res) => {
  try {
    const { repoId, name, fullName, defaultBranch } = req.body;

    // check if already exists
    const exists = await Repo.findOne({ repoId, userId: req.user.id });

    if (exists) {
      exists.active = true;
      await exists.save();
      return res.json({ message: "Repository activated" });
    }

    await Repo.create({
      userId: req.user.id,
      repoId,
      name,
      fullName,
      defaultBranch,
      active: true,
    });

    res.json({ message: "Repository activated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Activation failed" });
  }
});

module.exports = router;
