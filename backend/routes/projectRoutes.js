const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const Task = require("../models/Task");
const { verifyJWT } = require("../middleware/verifyJWT");
const roleMiddleware = require("../middleware/roleMiddleware");

// CREATE PROJECT
router.post(
  "/",
  verifyJWT,
  roleMiddleware(["Admin", "Manager"]),
  async (req, res) => {
    try {
      const { name, description, assignedTo } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Project name is required",
        });
      }

      const project = await Project.create({
        name,
        description,
        assignedTo: assignedTo || null,
        status: "Pending",
        progress: 0,
        createdBy: req.user._id,
        companyId: req.user.companyId,
      });

      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL PROJECTS WITH AUTO STATUS + PROGRESS
router.get("/", verifyJWT, async (req, res) => {
  try {
    const projects = await Project.find({
      companyId: req.user.companyId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({
          projectId: project._id,
          companyId: req.user.companyId,
        });

        const completedTasks = await Task.countDocuments({
          projectId: project._id,
          companyId: req.user.companyId,
          status: "Completed",
        });

        const progress =
          totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        let status = "Pending";

        if (totalTasks === 0) {
          status = "Pending";
        } else if (completedTasks === totalTasks) {
          status = "Completed";
        } else if (completedTasks > 0) {
          status = "In Progress";
        } else {
          status = "Pending";
        }

        await Project.findByIdAndUpdate(project._id, {
          status,
          progress,
        });

        return {
          ...project._doc,
          totalTasks,
          completedTasks,
          progress,
          status,
        };
      })
    );

    res.json(projectsWithProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE PROJECT WITH AUTO STATUS + PROGRESS
router.get("/:id", verifyJWT, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const totalTasks = await Task.countDocuments({
      projectId: project._id,
      companyId: req.user.companyId,
    });

    const completedTasks = await Task.countDocuments({
      projectId: project._id,
      companyId: req.user.companyId,
      status: "Completed",
    });

    const progress =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    let status = "Pending";

    if (totalTasks === 0) {
      status = "Pending";
    } else if (completedTasks === totalTasks) {
      status = "Completed";
    } else if (completedTasks > 0) {
      status = "In Progress";
    } else {
      status = "Pending";
    }

    await Project.findByIdAndUpdate(project._id, {
      status,
      progress,
    });

    res.json({
      ...project._doc,
      totalTasks,
      completedTasks,
      progress,
      status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PROJECT
router.put(
  "/:id",
  verifyJWT,
  roleMiddleware(["Admin", "Manager"]),
  async (req, res) => {
    try {
      const { name, description, assignedTo } = req.body;

      const project = await Project.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId: req.user.companyId,
        },
        {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(assignedTo !== undefined && { assignedTo }),
        },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE PROJECT
router.delete(
  "/:id",
  verifyJWT,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const project = await Project.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyId,
      });

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      await Task.deleteMany({
        projectId: project._id,
        companyId: req.user.companyId,
      });

      res.json({
        message: "Project and related tasks deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;