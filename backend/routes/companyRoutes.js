const express = require("express");
const router = express.Router();

const Company = require("../models/Company");
const { verifyJWT } = require("../middleware/verifyJWT");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/me", verifyJWT, async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/me",
  verifyJWT,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { companyName, companyPlan } = req.body;

      const company = await Company.findByIdAndUpdate(
        req.user.companyId,
        {
          companyName,
          companyPlan,
        },
        { new: true }
      );

      res.json(company);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;