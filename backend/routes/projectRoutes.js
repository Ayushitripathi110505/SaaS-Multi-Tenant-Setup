const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const { verifyJWT } = require("../middleware/authMiddleware");
const { isAdmin, isManager } = require("../middleware/roleMiddleware");


// ===============================
// ✅ CREATE PROJECT (Admin / Manager)
// ===============================
router.post(
  "/",
  verifyJWT,
  async (req, res) => {
    try {
      // Optional: restrict creation
      if (!["Admin", "Manager"].includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const { name, description } = req.body;

      const project = await Project.create({
        name,
      description,
      assignedTo, // 🔥 link user
      createdBy: req.user._id,
      companyId: req.user.companyId,
      });

      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ===============================
// ✅ GET ALL PROJECTS (Company-wise)
// ===============================
router.get(
  "/",
  verifyJWT,
  async (req, res) => {
    try {
      const projects = await Project.find({
        companyId: req.user.companyId
      }).populate("assignedTo", "name email") 
      .populate("createdBy", "name");

      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ===============================
// ✅ GET SINGLE PROJECT
// ===============================
router.get(
  "/:id",
  verifyJWT,
  async (req, res) => {
    try {
      const project = await Project.findOne({
        _id: req.params.id,
        companyId: req.user.companyId
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ===============================
// ✅ UPDATE PROJECT
// ===============================
router.put(
  "/:id",
  verifyJWT,
  async (req, res) => {
    try {
      if (!["Admin", "Manager"].includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const project = await Project.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId: req.user.companyId
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


// ===============================
// ✅ DELETE PROJECT
// ===============================
router.delete(
  "/:id",
  verifyJWT,
  async (req, res) => {
    try {
      if (req.user.role !== "Admin") {
        return res.status(403).json({ error: "Only Admin can delete projects" });
      }

      const project = await Project.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyId
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json({ message: "Project deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;