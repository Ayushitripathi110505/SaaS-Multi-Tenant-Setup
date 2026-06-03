const Log = require("../models/Log");

const createLog = async (userId, companyId, action) => {
  if (!userId || !companyId || !action) {
    return null;
  }

  return await Log.create({
    userId,
    companyId,
    action,
  });
};

module.exports = { createLog };