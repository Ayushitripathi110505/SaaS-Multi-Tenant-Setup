const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyPlan: {
      type: String,
      enum: ["Premium", "Basic", "Standard"],
      default: "Basic",
    },

    companyCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);