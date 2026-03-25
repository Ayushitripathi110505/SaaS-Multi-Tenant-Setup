const express=require("express");
const router=express.Router();
const User=require("../models/User");
const Project=require("../models/Project");
const Task = require("../models/Task");

const {VerifyJWT, verifyJWT}=require("../middleware/authMiddleware");

//dashboard analytics

router.get("/",verifyJWT,async(req,res)=>{
    try{
       const companyId = req.user.companyId;
    const totalUsers = await User.countDocuments({ companyId });
    const totalProjects = await Project.countDocuments({ companyId });
    const totalTasks=await Task.countDocuments({companyId});
    const completedProjects = await Project.countDocuments({
        companyId,
        status: "Completed"
    });
    const inProgressProjects = await Project.countDocuments({
        companyId,
        status: "In Progress"
    });
      const pendingTasks = await Task.countDocuments({
      companyId,
      status: "Pending",
    });
      const inProgressTasks = await Task.countDocuments({
      companyId,
      status: "In Progress",
    });

    const completedTasks = await Task.countDocuments({
      companyId,
      status: "Completed",
    });
    res.json({
        totalUsers,
        totalTasks,
        totalProjects,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        completedProjects,
        inProgressProjects
    });

    }catch(err){
         res.status(500).json({ error: err.message }); 
    }
   
    
});

module.exports = router;
