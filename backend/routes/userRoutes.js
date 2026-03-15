const express=require("express");
const router=express.Router();
const User=require("../models/User");

const{ verifyJWT }=require("../middleware/authMiddleware");
const{ isAdmin }=require("../middleware/roleMiddleware");

//get all users in a company
router.get("/",verifyJWT,isAdmin,async(req,res)=>{
    const users=await User.find({
        companyId:req.user.companyId
    });

    res.json(users);
});

//create user
router.post("/",verifyJWT,isAdmin,async(req,res)=>{
    const user=await User.create(req.body);
    res.json(user);
});

//delete user
router.delete("/:id",verifyJWT,isAdmin,async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);

    res.json({message:"User Deleted"});
});

module.exports=router;