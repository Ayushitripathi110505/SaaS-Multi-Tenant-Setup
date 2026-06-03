const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const Task = require("../models/Task");
const { verifyJWT } = require("../middleware/verifyJWT");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/task/:taskId",
  verifyJWT,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const task = await Task.findOne({
        _id: req.params.taskId,
        companyId: req.user.companyId,
      });

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      task.attachments.push({
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
      });

      await task.save();

      res.json({
        message: "File uploaded successfully",
        task,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;