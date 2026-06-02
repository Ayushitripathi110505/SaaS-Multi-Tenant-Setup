const Notification = require("../models/Notification");

const createNotification = async (userId, message) => {
  console.log("createNotification called");

  await Notification.create({
    userId,
    message,
  });
};

module.exports = { createNotification };