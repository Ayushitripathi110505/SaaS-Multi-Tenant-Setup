const Project = require("../models/Project");
const Task = require("../models/Task");

const updateProjectStatus = async (projectId) => {
  const tasks = await Task.find({ projectId });

  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    await Project.findByIdAndUpdate(projectId, {
      status: "Pending",
      progress: 0,
    });
    return;
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progress = Math.round(
    (completedTasks / totalTasks) * 100
  );

  let status = "Pending";

  if (completedTasks === totalTasks) {
    status = "Completed";
  } else if (completedTasks > 0) {
    status = "In Progress";
  }

  await Project.findByIdAndUpdate(projectId, {
    status,
    progress,
  });
};

module.exports = updateProjectStatus;