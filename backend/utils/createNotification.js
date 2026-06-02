const Notification = require("../models/Notification");

const createNotification = async (userId, message) => {
  if (!userId || !message) {
    return null;
  }

  const notification = await Notification.create({
    userId,
    message,
  });

  return notification;
};

module.exports = { createNotification };