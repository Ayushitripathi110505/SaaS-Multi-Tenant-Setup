const express=require("express");
const router=express.Router();
const User=require("../models/User");
const Project=require("../models/Project");

const {VerifyJWT, verifyJWT}=require("../middleware/authMiddleware");

//dashboard analytics

router.get("/",verifyJWT,async(req,res)=>{
    const companyId = req.user.companyId;
    const totalUsers = await User.countDocuments({ companyId });
    const totalProjects = await Project.countDocuments({ companyId });
    const completedProjects = await Project.countDocuments({
        companyId,
        status: "Completed"
    });
    const inProgressProjects = await Project.countDocuments({
        companyId,
        status: "In Progress"
    });
    res.json({
        totalUsers,
        totalProjects,
        completedProjects,
        inProgressProjects
    });

});

module.exports = router;
