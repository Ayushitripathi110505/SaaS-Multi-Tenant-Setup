const Task = require("../models/Task");
const { createLog } = require("../utils/createLog");
const { createNotification } = require("../utils/createNotification");

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, status } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      status: status || "Pending",
      createdBy: req.user._id,
      companyId: req.user.companyId,
    });

    await createLog(req.user._id, req.user.companyId, "Created Task");

    if (task.assignedTo) {
      await createNotification(
        task.assignedTo,
        "You have been assigned a new task"
      );
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId,
      },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await createLog(req.user._id, req.user.companyId, "Updated Task");

    if (task.assignedTo) {
      await createNotification(task.assignedTo, "Task status updated");
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId,
      },
      { status: "Completed" },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await createLog(req.user._id, req.user.companyId, "Completed Task");

    if (task.assignedTo) {
      await createNotification(task.assignedTo, "🎉 Task completed");
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  completeTask,
};