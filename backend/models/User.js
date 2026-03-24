const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
 

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  role: {
    type: String,
    enum: ["Admin", "Employee", "Manager"],
    default: "Employee"
  },

  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);