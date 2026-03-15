function checkcompanyAccess(req,res,next){
    const userCompany=req.user.companyId;
    const requestedCompany=req.params.companyId;

    if(userCompany!=requestedCompany){
        return res.status(403).send("Access denied:Company mismatch");
    }
    next();
}
module.exports={checkcompanyAccess};