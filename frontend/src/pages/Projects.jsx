import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    assignedTo: "",
  });

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);

      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/list");
      setUsers(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", {
        name: form.name,
        description: form.description,
        assignedTo: form.assignedTo || null,
      });

      setForm({
        name: "",
        description: "",
        assignedTo: "",
      });

      fetchProjects();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.error || "Project creation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div>
      <h2>📁 Projects</h2>

      <form onSubmit={handleCreate}>
        <input
          name="name"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />

        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
        >
          <option value="">Assign User</option>

          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>

        <br />

        <button type="submit">Create Project</button>
      </form>

      <hr />

      {projects.length === 0 && <p>No projects found</p>}

      {projects.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3
            onClick={() => navigate(`/projects/${p._id}`)}
            style={{ cursor: "pointer" }}
          >
            {p.name}
          </h3>

          <p>{p.description}</p>

          <p>Assigned To: {p.assignedTo?.name || "Not Assigned"}</p>

          <p>Status: {p.status}</p>

          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Projects;