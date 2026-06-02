import React from "react";

function TaskCard({ task }) {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Assigned To: {task.assignedTo?.name || "Unassigned"}</p>
    </div>
  );
}

export default TaskCard;