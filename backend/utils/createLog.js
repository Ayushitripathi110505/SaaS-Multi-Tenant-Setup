const Log = require("../models/Log");

const createLog = async (userId, companyId, action) => {
  await Log.create({
    userId,
    companyId,
    action,
  });
};

module.exports = { createLog };