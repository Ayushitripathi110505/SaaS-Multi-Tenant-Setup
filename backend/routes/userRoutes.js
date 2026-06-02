const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { verifyJWT } = require("../middleware/verifyJWT");
const roleMiddleware = require("../middleware/roleMiddleware");

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

router.get("/list", verifyJWT, async (req, res) => {
  try {
    const users = await User.find({
      companyId: req.user.companyId,
    }).select("name email role");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/",
  verifyJWT,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Name, email and password are required",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          error: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "Employee",
        companyId: req.user.companyId,
      });

      const { password: _, ...userWithoutPassword } = user._doc;

      res.status(201).json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  "/:id/role",
  verifyJWT,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { role } = req.body;

      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId: req.user.companyId,
        },
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      res.json(user);
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
      const user = await User.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyId,
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;