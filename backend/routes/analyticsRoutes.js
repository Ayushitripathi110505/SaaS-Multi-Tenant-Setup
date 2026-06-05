const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const { verifyJWT } = require("../middleware/verifyJWT");

router.get("/", verifyJWT, async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const totalUsers = await User.countDocuments({ companyId });
    const totalProjects = await Project.countDocuments({ companyId });
    const totalTasks = await Task.countDocuments({ companyId });

    const pendingTasks = await Task.countDocuments({
      companyId,
      status: "Pending",
    });

    const inProgressTasks = await Task.countDocuments({
      companyId,
      status: "In Progress",
    });

    const completedTasks = await Task.countDocuments({
      companyId,
      status: "Completed",
    });

    const projects = await Project.find({ companyId });

    let completedProjects = 0;
    let inProgressProjects = 0;
    let pendingProjects = 0;

    for (const project of projects) {
      const totalProjectTasks = await Task.countDocuments({
        companyId,
        projectId: project._id,
      });

      const completedProjectTasks = await Task.countDocuments({
        companyId,
        projectId: project._id,
        status: "Completed",
      });

      if (totalProjectTasks === 0) {
        pendingProjects++;
      } else if (completedProjectTasks === totalProjectTasks) {
        completedProjects++;
      } else if (completedProjectTasks > 0) {
        inProgressProjects++;
      } else {
        pendingProjects++;
      }
    }

    res.json({
      totalUsers,
      totalProjects,
      totalTasks,

      pendingTasks,
      inProgressTasks,
      completedTasks,

      pendingProjects,
      completedProjects,
      inProgressProjects,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;