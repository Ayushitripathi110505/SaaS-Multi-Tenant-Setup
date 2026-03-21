const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const { verifyJWT } = require("../middleware/authMiddleware");
const { isAdmin, isManager } = require("../middleware/roleMiddleware");


// ✅ Create Project (Admin / Manager)
router.post("/", verifyJWT, async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      companyId: req.user.companyId,
      createdBy: req.user._id
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get All Projects (Company-wise)
router.get("/", verifyJWT, async (req, res) => {
  try {
    const projects = await Project.find({
      companyId: req.user.companyId
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Update Project
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Delete Project
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;