const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const { verifyJWT } = require("../middleware/verifyJWT");

router.get("/", verifyJWT, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;