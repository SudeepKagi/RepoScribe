const router = require("express").Router();
const Repo = require("../models/Repo");
const readmeQueue = require("../utils/queue");

router.post("/", async (req, res) => {
  try {
    const event = req.headers["x-github-event"];

    if (event !== "push") {
      return res.json({ message: "Not a push event" });
    }

    const repoId = req.body.repository.id;

    // check if repo is active
    const repo = await Repo.findOne({ repoId, active: true });

    if (!repo) {
      return res.json({ message: "Repo not activated" });
    }

    console.log("🔥 Push received, adding job to queue");

    await readmeQueue.add("generate", {
      repoId: repo.repoId,
      fullName: repo.fullName,
    });

    // later → queue job here

    res.json({ message: "Webhook received" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Webhook failed" });
  }
});

module.exports = router;
