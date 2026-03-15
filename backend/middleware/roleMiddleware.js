function isUser(req,res,next){
    if(req.user.role!="Employee"){
        return res.status(403).send("access denied:Employees Only");
    }
    next();
}

function isAdmin(req,res,next){
    if(req.user.role!=="Admin"){
        return res.status(403).send("access denied:Admins Only");
    }
    next();
}

function isManager(req,res,next){
    if(req.user.role!=="Manager"){
         return res.status(403).send("access denied:Managers only");
    }
    next();
}

module.exports={isManager,isAdmin,isUser};