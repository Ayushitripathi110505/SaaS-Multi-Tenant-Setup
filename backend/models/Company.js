const mongoose=require("mongoose");

const companySchema=new mongoose.Schema({
  companyName:{
    type:String,
    required:true
  },
  companyPlan:{
    type:String,
    required:true,
    enum:["Premium","Basic","Standard"],
    default:"Basic"
  }
}, { timestamps: true });

mongoose.exports=mongoose.model("Company",companySchema);