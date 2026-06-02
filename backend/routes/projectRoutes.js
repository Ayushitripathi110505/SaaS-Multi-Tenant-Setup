const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const { verifyJWT } = require("../middleware/verifyJWT");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  verifyJWT,
  roleMiddleware(["Admin", "Manager"]),
  async (req, res) => {
    try {
      const { name, description, assignedTo, status } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Project name is required" });
      }

      const project = await Project.create({
        name,
        description,
        assignedTo: assignedTo || null,
        status: status || "In Progress",
        createdBy: req.user._id,
        companyId: req.user.companyId,
      });

      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get("/", verifyJWT, async (req, res) => {
  try {
    const projects = await Project.find({
      companyId: req.user.companyId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", verifyJWT, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/:id",
  verifyJWT,
  roleMiddleware(["Admin", "Manager"]),
  async (req, res) => {
    try {
      const project = await Project.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId: req.user.companyId,
        },
        req.body,
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

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
        return res.status(404).json({ error: "Project not found" });
      }

      res.json({ message: "Project deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;