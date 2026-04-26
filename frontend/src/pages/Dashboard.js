import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    users: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= STYLES =================
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

  // ================= CHART =================
  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inProgress },
    { name: "Completed", value: stats.completed },
  ];

  const COLORS = ["#ff4d4f", "#faad14", "#52c41a"];

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      let query = [];

      if (status) query.push(`status=${status}`);
      if (search) query.push(`search=${search}`);

      const url = `/tasks?${query.join("&")}`;

      const res = await API.get(url);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTasks();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, status]);

  // ================= FETCH STATS =================
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
  }, []);

  // ================= CALC =================
  const completionRate =
    stats.tasks > 0
      ? Math.round((stats.completed / stats.tasks) * 100)
      : 0;

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>

      {/* 👋 Welcome */}
      <h1>Welcome, {user.name} 👋</h1>

      {/* ================= PROGRESS ================= */}
      <h2>Task Progress</h2>
      <p>
        {stats.completed} / {stats.tasks} Tasks Completed ({completionRate}%)
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

      {/* ================= TASK SECTION ================= */}
      <div style={{ marginTop: "20px" }}>
        <h2>Tasks</h2>

        {/* 🔍 Search + Filter */}
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
            <option value="pending">Pending</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <h4>Total Tasks Found: {tasks.length}</h4>

        {/* 📋 Task List */}
        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} style={styles.taskCard}>
              <h3>{task.title}</h3>
              <p>
                Status: <strong>{task.status}</strong>
              </p>
            </div>
          ))
        )}
      </div>

      {/* ================= CHART ================= */}
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

      {/* ================= PROFILE ================= */}
      <div style={styles.card}>
        <h3>Profile</h3>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <button onClick={logout}>Logout</button>
      </div>

      {/* ================= ROLE DASHBOARDS ================= */}
      {user.role === "Admin" && (
        <div>
          <h3>🛠 Admin Dashboard</h3>
          {!loading && (
            <>
              <p>Projects: {stats.projects}</p>
              <p>Tasks: {stats.tasks}</p>
              <p>Users: {stats.users}</p>
            </>
          )}
        </div>
      )}

      {user.role === "Manager" && (
        <div>
          <h3>📊 Manager Dashboard</h3>
          {!loading && (
            <>
              <p>Projects: {stats.projects}</p>
              <p>Tasks: {stats.tasks}</p>
            </>
          )}
        </div>
      )}

      {user.role === "Employee" && (
        <div>
          <h3>🧑‍💻 Employee Dashboard</h3>
          {!loading && <p>My Tasks: {stats.tasks}</p>}
        </div>
      )}
    </div>
  );
}

export default Dashboard;