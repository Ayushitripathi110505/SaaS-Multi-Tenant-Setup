import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const navigate = useNavigate();

  // 🔄 Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects"); // ✅ FIXED (your backend)
      setProjects(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);

      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✍️ Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Create Project
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ❌ Delete Project
  const handleDelete = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div>
      <h2>📁 Projects</h2>

      {/* Create Project */}
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

        <button type="submit">Create Project</button>
      </form>

      <hr />

      {/* Project List */}
      {projects.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3 onClick={() => navigate(`/projects/${p._id}`)}>
            {p.name}
          </h3>

          <p>{p.description}</p>
           <p>
              Assigned To: {p.assignedTo?.name || "Not Assigned"}
           </p>
          <button onClick={() => handleDelete(p._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Projects;