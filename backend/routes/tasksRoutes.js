const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const { verifyJWT } = require("../middleware/authMiddleware");


// ===============================
// ✅ CREATE TASK
// ===============================
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, status } = req.body;

    // ✅ VALIDATION (NEW)
    if (!title || !projectId) {
      return res.status(400).json({
        message: "Title and ProjectId are required"
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      status: status || "Pending", // ✅ DEFAULT STATUS FIX
      createdBy: req.user._id,
      companyId: req.user.companyId
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// ✅ GET TASKS (COMPANY + ROLE BASED)
// ===============================
router.get("/", verifyJWT, async (req, res) => {
  try {
    let filter = { companyId: req.user.companyId };

    // ✅ ROLE BASED FILTER (unchanged but correct)
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


// ===============================
// ✅ GET TASKS BY PROJECT
// ===============================
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


// ===============================
// ✅ UPDATE TASK (SECURED FIX)
// ===============================
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId // ✅ SECURITY FIX (multi-tenant)
      },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//=========================
// Search ========================
router.get("/", verifyJWT, async (req, res) => {
  try {
    const { status, search } = req.query;

    let filter = {
      companyId: req.user.companyId
    };

    // Employee restriction
    if (req.user.role === "Employee") {
      filter.assignedTo = req.user._id;
    }

    if (status) filter.status = status;

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// ✅ DELETE TASK (SECURED FIX)
// ===============================
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId // ✅ SECURITY FIX
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;