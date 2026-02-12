const router = require("express").Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-accessToken");

  res.json(user);
});

module.exports = router;
