const Notification = require("../models/Notification");

const createNotification = async (userId, message, io = null) => {
  if (!userId || !message) return null;

  const notification = await Notification.create({
    userId,
    message,
  });

  if (io) {
    io.to(userId.toString()).emit("newNotification", notification);
  }

  return notification;
};

module.exports = { createNotification };