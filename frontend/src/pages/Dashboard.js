import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    totalUsers: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    completedProjects: 0,
    inProgressProjects: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      padding: "30px",
      fontFamily: "Arial",
    },
    card: {
      padding: "20px",
      borderRadius: "10px",
      background: "#f5f5f5",
      marginBottom: "20px",
    },
    taskCard: {
      border: "1px solid #ddd",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "10px",
      background: "#fafafa",
    },
    input: {
      padding: "8px",
      marginRight: "10px",
    },
    select: {
      padding: "8px",
    },
  };

  const chartData = [
    { name: "Pending", value: stats.pendingTasks },
    { name: "In Progress", value: stats.inProgressTasks },
    { name: "Completed", value: stats.completedTasks },
  ];

  const COLORS = ["#ff4d4f", "#faad14", "#52c41a"];

  const fetchTasks = async () => {
    try {
      const query = [];

      if (status) query.push(`status=${status}`);
      if (search) query.push(`search=${search}`);

      const url = query.length > 0 ? `/tasks?${query.join("&")}` : "/tasks";

      const res = await API.get(url);
      setTasks(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTasks();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, status]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/analytics");
        setStats(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchTasks();
  }, []);

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1>Welcome, {user.name} 👋</h1>

      <h2>Task Progress</h2>

      <p>
        {stats.completedTasks} / {stats.totalTasks} Tasks Completed (
        {completionRate}%)
      </p>

      <div style={{ width: "100%", background: "#eee", borderRadius: "10px" }}>
        <div
          style={{
            width: `${completionRate}%`,
            background: "green",
            color: "white",
            padding: "5px",
            borderRadius: "10px",
          }}
        >
          {completionRate}%
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Tasks</h2>

        <div style={{ marginBottom: "10px" }}>
          <input
            style={styles.input}
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            style={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <h4>Total Tasks Found: {tasks.length}</h4>

        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} style={styles.taskCard}>
              <h3>{task.title}</h3>
              <p>
                Status: <strong>{task.status}</strong>
              </p>
              <p>
                Project: <strong>{task.projectId?.name || "N/A"}</strong>
              </p>
              <p>
                Assigned To:{" "}
                <strong>{task.assignedTo?.name || "Unassigned"}</strong>
              </p>
            </div>
          ))
        )}
      </div>

      <h3>Task Distribution</h3>

      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>

      <div style={styles.card}>
        <h3>Profile</h3>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <button onClick={logout}>Logout</button>
      </div>

      {user.role === "Admin" && (
        <div>
          <h3>🛠 Admin Dashboard</h3>

          {!loading && (
            <>
              <p>Projects: {stats.totalProjects}</p>
              <p>Tasks: {stats.totalTasks}</p>
              <p>Users: {stats.totalUsers}</p>
              <p>Completed Projects: {stats.completedProjects}</p>
              <p>In Progress Projects: {stats.inProgressProjects}</p>
            </>
          )}
        </div>
      )}

      {user.role === "Manager" && (
        <div>
          <h3>📊 Manager Dashboard</h3>

          {!loading && (
            <>
              <p>Projects: {stats.totalProjects}</p>
              <p>Tasks: {stats.totalTasks}</p>
              <p>Pending Tasks: {stats.pendingTasks}</p>
              <p>In Progress Tasks: {stats.inProgressTasks}</p>
              <p>Completed Tasks: {stats.completedTasks}</p>
            </>
          )}
        </div>
      )}

      {user.role === "Employee" && (
        <div>
          <h3>🧑‍💻 Employee Dashboard</h3>

          {!loading && (
            <>
              <p>My Company Tasks: {stats.totalTasks}</p>
              <p>Completed Tasks: {stats.completedTasks}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;