const express=require("express");
const router=express.Router();
const User=require("../models/User");
const Company=require("../models/Company");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

// ===============================
// ✅ REGISTER (UPDATED)
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { email, name, password, role, companyId, adminKey,companyCode } = req.body;
    if (!companyCode) {
      return res.status(400).json({ error: "Company code is required" });
    }
    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const company = await Company.findOne({ companyCode });

    if (!company) {
      return res.status(400).json({ error: "Invalid company code" });
    }

    // 🔐 Admin protection
    if (role === "Admin") {
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({
          message: "Invalid Admin Secret Key",
        });
      }
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "Employee", // ✅ role from frontend
      companyId:company._id,
    });

    await user.save();

    res.json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//-------------------------------------------------
//----------------create company-------------------
//-------------------------------------------------
router.post("/create-company", async (req, res) => {
  try {
    const { companyName, companyPlan, name, email, password, adminKey } = req.body;

    // 🔐 check admin key
    if (adminKey !==process.env.ADMIN_SECRET_KEY ) {
      return res.status(403).json({ error: "Invalid admin key" });
    }

    // 🔹 generate company code
    const companyCode = companyName.slice(0, 3).toUpperCase() + Math.floor(Math.random() * 1000);

    // 🔹 create company
    const company = await Company.create({
      companyName,
      companyPlan,
      companyCode
    });

    // 🔹 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 create admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      companyId: company._id
    });

    res.json({
      message: "Company created successfully",
      companyCode,  // 🔥 VERY IMPORTANT
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports=router;