const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Project = require("../models/Project");
const { verifyJWT } = require("../middleware/verifyJWT");
const roleMiddleware = require("../middleware/roleMiddleware");
const { createNotification } = require("../utils/createNotification");
const { createLog } = require("../utils/createLog");
// CREATE TASK
router.post(
  "/",
  verifyJWT,
  roleMiddleware(["Admin", "Manager"]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        assignedTo,
        projectId,
        status,
        priority,
        dueDate,
      } = req.body;

      if (!title || !projectId) {
        return res.status(400).json({
          error: "Title and projectId are required",
        });
      }

      const project = await Project.findOne({
        _id: projectId,
        companyId: req.user.companyId,
      });

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      const task = await Task.create({
        title,
        description,
        assignedTo: assignedTo || null,
        projectId,
        status: status || "Pending",
        priority: priority || "Medium",
        dueDate: dueDate || null,
        createdBy: req.user._id,
        companyId: req.user.companyId,
      });

      if (assignedTo) {
        await createNotification(
          assignedTo,
          "You have been assigned a new task",
          req.app.get("io")
        );
      }
      await createLog(
      req.user._id,
      req.user.companyId,
      `Created task: ${task.title}`
    );

      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET TASKS
router.get("/", verifyJWT, async (req, res) => {
  try {
    const { status, search, priority } = req.query;

    const filter = {
      companyId: req.user.companyId,
    };

    if (req.user.role === "Employee") {
      filter.assignedTo = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET TASKS BY PROJECT
router.get("/project/:projectId", verifyJWT, async (req, res) => {
  try {
    const filter = {
      projectId: req.params.projectId,
      companyId: req.user.companyId,
    };

    if (req.user.role === "Employee") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE TASK
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const filter = {
      _id: req.params.id,
      companyId: req.user.companyId,
    };

    if (req.user.role === "Employee") {
      filter.assignedTo = req.user._id;
    }

    const oldTask = await Task.findOne(filter);

    if (!oldTask) {
      return res.status(404).json({
        error: "Task not found or access denied",
      });
    }

    const task = await Task.findOneAndUpdate(filter, req.body, {
      new: true,
    });

    if (
      task.assignedTo &&
      req.body.status &&
      req.body.status !== oldTask.status
    ) {
      await createNotification(
        task.assignedTo,
        `Task status updated to ${task.status}`,
        req.app.get("io")
      );
    }
    await createLog(
      req.user._id,
      req.user.companyId,
      `Updated task: ${task.title}`
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE TASK
router.delete(
  "/:id",
  verifyJWT,
  roleMiddleware(["Admin", "Manager"]),
  async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyId,
      });

      if (!task) {
        return res.status(404).json({
          error: "Task not found",
        });
      }
      await createLog(
      req.user._id,
      req.user.companyId,
      `Deleted task: ${task.title}`
    );

      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;