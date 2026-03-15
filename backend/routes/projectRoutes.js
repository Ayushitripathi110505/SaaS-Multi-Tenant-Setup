const express=require("express");
const router=express.Router();
const Project=require("../models/Project");

const { verifyJWT }=require("../middleware/authMiddleware");

//create task
router.post("/",verifyJWT,async(req,res)=>{
    const project=new Project({
        ...req.body,
        companyId:req.user.companyId
    });
    await Project.save();
    res.json(project);
});

//get all task

router.get("/",verifyJWT,async(req,res)=>{
    const tasks=await Project.find({
        companyId:req.user.companyId
    }).populate("assignedTo");
    res.json(tasks);
});

//update tasks
router.put("/:id",verifyJWT,async(req,res)=>{
    const updated=await Project.findByIdAndDelete(
        req.params.id,
        req.body,
        {new:true}
    );
    res.json(updated);
});

module.exports=router;