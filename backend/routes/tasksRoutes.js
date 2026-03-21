const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const { verifyJWT } = require("../middleware/authMiddleware");


// ✅ Create Task
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { title, description, assignedTo, projectId } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      createdBy: req.user._id,
      companyId: req.user.companyId
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get Tasks (Company + Role-based)
router.get("/", verifyJWT, async (req, res) => {
  try {
    let filter = { companyId: req.user.companyId };

    if (req.user.role === "Employee") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get Tasks by Project
router.get("/project/:projectId", verifyJWT, async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId,
      companyId: req.user.companyId
    }).populate("assignedTo", "name");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Update Task
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Delete Task
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;