import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  // ===============================
  // Fetch all data
  // ===============================
  const fetchData = async () => {
    try {
      const projectRes = await API.get(`/projects/${id}`);
      const tasksRes = await API.get(`/tasks/project/${id}`);
      const usersRes = await API.get(`/users`); // ✅ FIXED

      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ===============================
  // Handle input
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===============================
  // Create Task
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title: form.title,
        description: form.description,
        assignedTo: form.assignedTo,
        projectId: id, // ✅ correct
        status: "Pending",
      });

      setForm({ title: "", description: "", assignedTo: "" });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // Update status
  // ===============================
  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📁 {project.name}</h2>
      <p>{project.description}</p>

      <hr />

      {/* ================= Create Task ================= */}
      <h3>Create Task</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />

        {/* ✅ USER DROPDOWN */}
        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>

        <br />

        <button type="submit">Create Task</button>
      </form>

      <hr />

      {/* ================= Tasks ================= */}
      <h3>Tasks</h3>

      {tasks.length === 0 && <p>No tasks found</p>}

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>

          <p>
            Assigned To: {task.assignedTo?.name || "Unassigned"}
          </p>

          <p>Status: {task.status}</p>

          <select
            value={task.status}
            onChange={(e) =>
              updateStatus(task._id, e.target.value)
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

export default ProjectDetails;