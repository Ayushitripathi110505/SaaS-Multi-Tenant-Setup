const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// CREATE COMPANY + ADMIN USER
// ===============================
router.post("/create-company", async (req, res) => {
  try {
    const { companyName, companyPlan, name, email, password, adminKey } = req.body;

    if (!companyName || !name || !email || !password || !adminKey) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        error: "Invalid admin key",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    let companyCode;
    let existingCompanyCode;

    do {
      companyCode =
        companyName.slice(0, 3).toUpperCase() +
        Math.floor(1000 + Math.random() * 9000);

      existingCompanyCode = await Company.findOne({ companyCode });
    } while (existingCompanyCode);

    const company = await Company.create({
      companyName,
      companyPlan: companyPlan || "Basic",
      companyCode,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      companyId: company._id,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        companyId: company._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      message: "Company created successfully",
      companyCode,
      token,
      company,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ===============================
// REGISTER EMPLOYEE / MANAGER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { email, name, password, role, companyCode, adminKey } = req.body;

    if (!email || !name || !password || !companyCode) {
      return res.status(400).json({
        error: "Name, email, password and company code are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const company = await Company.findOne({
      companyCode: companyCode.toUpperCase(),
    });

    if (!company) {
      return res.status(400).json({
        error: "Invalid company code",
      });
    }

    if (role === "Admin") {
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({
          error: "Invalid Admin Secret Key",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Employee",
      companyId: company._id,
    });

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).populate("companyId");

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        companyId: user.companyId._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;