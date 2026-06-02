const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Project = require("../models/Project");
const { verifyJWT } = require("../middleware/verifyJWT");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  verifyJWT,
  roleMiddleware(["Admin", "Manager"]),
  async (req, res) => {
    try {
      const { title, description, assignedTo, projectId, status } = req.body;

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
          error: "Project not found in your company",
        });
      }

      const task = await Task.create({
        title,
        description,
        assignedTo: assignedTo || null,
        projectId,
        status: status || "Pending",
        createdBy: req.user._id,
        companyId: req.user.companyId,
      });

      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get("/", verifyJWT, async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {
      companyId: req.user.companyId,
    };

    if (req.user.role === "Employee") {
      filter.assignedTo = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

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
      .populate("projectId", "name");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const filter = {
      _id: req.params.id,
      companyId: req.user.companyId,
    };

    if (req.user.role === "Employee") {
      filter.assignedTo = req.user._id;
    }

    const task = await Task.findOneAndUpdate(filter, req.body, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({
        error: "Task not found or access denied",
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;