import React, { useEffect, useState } from "react";
import API from "../api/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]); // ✅ NEW: store projects separately

  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    projectId: ""
  });

  // ===============================
  // ✅ FETCH TASKS
  // ===============================
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // ✅ FETCH USERS
  // ===============================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // ✅ FETCH PROJECTS (🔥 IMPORTANT FIX)
  // ===============================
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // LOAD ALL DATA
  // ===============================
  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchProjects(); // ✅ ADDED
  }, []);

  // ===============================
  // HANDLE FORM INPUT
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===============================
  // ✅ CREATE TASK
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        ...form,
        status: "Pending" // ✅ standardized
      });

      // reset form
      setForm({
        title: "",
        description: "",
        assignedTo: "",
        projectId: ""
      });

      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // ✅ GROUP TASKS BY PROJECT (ONLY FOR UI)
  // ===============================
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!task.projectId) return acc;

    const projectId = task.projectId._id;
    const projectName = task.projectId.name;

    if (!acc[projectId]) {
      acc[projectId] = {
        name: projectName,
        tasks: []
      };
    }

    acc[projectId].tasks.push(task);
    return acc;
  }, {});

  return (
    <div>
      <h2>📋 Tasks Dashboard</h2>

      {/* ===============================
          ✅ CREATE TASK BUTTON
      =============================== */}
      <button onClick={() => setShowModal(true)}>
        + Create Task
      </button>

      {/* ===============================
          FILTER
      =============================== */}
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <hr />

      {/* ===============================
          ✅ MODAL (CREATE TASK)
      =============================== */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px"
            }}
          >
            <h3>Create Task</h3>

            <form onSubmit={handleSubmit}>
              <input
                name="title"
                placeholder="Task Title"
                value={form.title}
                onChange={handleChange}
                required
              />

              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />

              {/* ✅ PROJECT DROPDOWN (FIXED) */}
              <select
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                required
              >
                <option value="">Select Project</option>

                {projects.map((p) => ( // ✅ FIXED SOURCE
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* USER DROPDOWN */}
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                required
              >
                <option value="">Assign User</option>

                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <br />

              <button type="submit">Create</button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===============================
          DISPLAY PROJECTS + TASKS
      =============================== */}

      {projects.length === 0 ? (
        <p>No Projects Found</p> // ✅ NOW WILL SHOW PROJECTS PROPERLY
      ) : (
        projects.map((project) => {
          const projectTasks = groupedTasks[project._id]?.tasks || [];

          return (
            <div
              key={project._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "8px"
              }}
            >
              <h3>📁 {project.name}</h3>

              {projectTasks.length === 0 ? (
                <p>No tasks yet</p>
              ) : (
                projectTasks
                  .filter((t) =>
                    filter === "All" ? true : t.status === filter
                  )
                  .map((task) => (
                    <div
                      key={task._id}
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginTop: "8px",
                        borderRadius: "5px"
                      }}
                    >
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>

                      <p>
                        Assigned: {task.assignedTo?.name || "None"}
                      </p>

                      <p>Status: {task.status}</p>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateStatus(task._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  ))
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Tasks;