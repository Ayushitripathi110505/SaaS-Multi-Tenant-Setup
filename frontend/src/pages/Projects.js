import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/projects").then(res => setProjects(res.data));
  }, []);

  return (
    <div>
      <h2>Projects</h2>

      {projects.map(p => (
        <div
          key={p._id}
          onClick={() => navigate(`/projects/${p._id}`)}
          style={{
            padding: "15px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            cursor: "pointer"
          }}
        >
          <h3>{p.name}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Projects;