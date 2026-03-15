const mongoose=require("mongoose");

const projectSchema=new mongoose.Schema({
    projectName:{
        type:String,
        required:true
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    description:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum:["Not Started","In Progress","Completed","On Hold"],
        default:"Not Started"
    },
    priority:{
        type:String,
        enum:["Low","High","Medium"],
        default:"Medium"
    },
    dueDate:{
        type:Date
    }
},{timestamps:true});

module.exports=mongoose.model("Project",projectSchema);