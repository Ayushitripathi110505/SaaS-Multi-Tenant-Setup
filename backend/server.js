require("dotenv").config();
const express=require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
connectDB();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/project", projectRoutes);
app.use("/analytics", analyticsRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});