import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
 useEffect(() => {
  API.get("/tasks")
    .then(res => setTasks(res.data))
    .catch(err => {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    });
}, [navigate]); // ✅ FIX

  return (
    <div>
      <h2>Tasks</h2>

      {tasks.map(t => (
        <div key={t._id}>
          <h3>{t.title}</h3>
          <p>{t.status}</p>
          <p>Project: {t.projectId?.name}</p>
          <p>Assigned: {t.assignedTo?.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Tasks;