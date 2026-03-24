const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { verifyJWT } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ===============================
// ✅ GET ALL USERS (Admin only)
// ===============================
router.get(
  "/",
  verifyJWT,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const users = await User.find({
        companyId: req.user.companyId,
      }).select("-password");

      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ===============================
// ✅ CREATE USER (Admin only)
// ===============================
router.post(
  "/",
  verifyJWT,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // check existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
    

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        companyId: req.user.companyId,
         // 🔥 enforce same company
      });

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ===============================
// ✅ UPDATE USER ROLE (Admin only)
// ===============================
router.put(
  "/:id/role",
  verifyJWT,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ===============================
// ✅ DELETE USER (Admin only)
// ===============================
router.delete(
  "/:id",
  verifyJWT,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  "/list",
  verifyJWT,
  async (req, res) => {
    try {
      const users = await User.find({
        companyId: req.user.companyId,
      }).select("name role");

      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;