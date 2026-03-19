require("dotenv").config();
const express=require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
connectDB();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});