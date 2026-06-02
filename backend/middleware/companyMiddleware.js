function checkcompanyAccess(req, res, next) {
  const userCompany = req.user.companyId.toString();
  const requestedCompany = req.params.companyId.toString();

  if (userCompany !== requestedCompany) {
    return res.status(403).json({
      error: "Access denied: Company mismatch",
    });
  }

  next();
}

module.exports = { checkcompanyAccess };