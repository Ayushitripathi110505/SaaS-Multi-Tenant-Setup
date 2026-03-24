const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  userId: {
    type: Number,
    unique: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    index: true
  },
  companyCode:{
    type:String,
    required:true
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