import React, { useEffect, useState } from "react";
import API from "../api/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔄 Update Status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // 🎯 Filter tasks
  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  return (
    <div>
      <h2>📋 Tasks</h2>

      {/* Filter */}
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <hr />

      {filteredTasks.map((t) => (
        <div
          key={t._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{t.title}</h3>
          <p>{t.description}</p>

          <p>Project: {t.projectId?.name}</p>
          <p>Assigned: {t.assignedTo?.name || "None"}</p>

          {/* Status Change */}
          <select
            value={t.status}
            onChange={(e) =>
              updateStatus(t._id, e.target.value)
            }
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default Tasks;