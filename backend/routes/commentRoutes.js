const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Task = require("../models/Task");
const { verifyJWT } = require("../middleware/verifyJWT");

router.post("/:taskId", verifyJWT, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      companyId: req.user.companyId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const comment = await Comment.create({
      taskId: req.params.taskId,
      userId: req.user._id,
      companyId: req.user.companyId,
      text,
    });

    const populatedComment = await comment.populate("userId", "name role");

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:taskId", verifyJWT, async (req, res) => {
  try {
    const comments = await Comment.find({
      taskId: req.params.taskId,
      companyId: req.user.companyId,
    })
      .populate("userId", "name role")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
      userId: req.user._id,
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;