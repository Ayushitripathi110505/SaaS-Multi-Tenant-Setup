const express = require("express");
const router = express.Router();

const Log = require("../models/Log");
const { verifyJWT } = require("../middleware/verifyJWT");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/",
  verifyJWT,
  roleMiddleware(["Admin", "Manager"]),
  async (req, res) => {
    try {
      const logs = await Log.find({
        companyId: req.user.companyId,
      })
        .populate("userId", "name email role")
        .sort({ createdAt: -1 });

      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;