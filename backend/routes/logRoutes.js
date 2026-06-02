const express = require("express");
const router = express.Router();

const Log = require("../models/Log");
const { verifyJWT } = require("../middleware/verifyJWT");

router.get("/", verifyJWT, async (req, res) => {
  try {
    const logs = await Log.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;