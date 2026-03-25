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
  // ✅ Chart Data (based on your stats)
const chartData = [
  { name: "Pending", value: stats.pending },
  { name: "In Progress", value: stats.inProgress },
  { name: "Completed", value: stats.completed },
];

// ✅ Colors for each status
const COLORS = ["#ff4d4f", "#faad14", "#52c41a"];
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch dashboard data
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
    // ✅ NEW: Safe calculation to avoid division by zero
  const completionRate =
    stats.tasks > 0
      ? Math.round((stats.completed / stats.tasks) * 100)
      : 0;

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
    title: {
      fontSize: "24px",
      marginBottom: "10px",
    },
    statBox: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    stat: {
      flex: 1,
      minWidth: "150px",
      padding: "20px",
      background: "#e3e3e3",
      borderRadius: "10px",
      textAlign: "center",
    },
    logoutBtn: {
      marginTop: "10px",
      padding: "8px 12px",
      cursor: "pointer",
    },
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      
      {/* 👋 Welcome */}
      <h1 style={styles.title}>
        Welcome, {user.name} 👋
      </h1>

        {/* ✅ NEW: Completion Stats */}
      <h2>Task Progress</h2>
      <p>
        {stats.completed} / {stats.tasks} Tasks Completed ({completionRate}%)
      </p>

      {/* ✅ NEW: Progress Bar */}
      <div style={{ width: "100%", background: "#eee", borderRadius: "10px", marginBottom: "20px" }}>
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

      {/* ✅ NEW: Pie Chart */}
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

      {/* 👤 Profile */}
      <div style={styles.card}>
        <h3>Profile</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {/* ================= ADMIN ================= */}
      {user.role === "Admin" && (
        <>
          <h3>🛠 Admin Dashboard</h3>

          <div style={styles.statBox}>
            {loading ? (
              <p>Loading stats...</p>
            ) : (
              <>
                <div style={styles.stat}>
                  <h2>{stats.projects}</h2>
                  <p>Projects</p>
                </div>

                <div style={styles.stat}>
                  <h2>{stats.tasks}</h2>
                  <p>Tasks</p>
                </div>

                <div style={styles.stat}>
                  <h2>{stats.users}</h2>
                  <p>Users</p>
                </div>
                 {/* ✅ NEW: Task Breakdown */}
                <div style={{ ...styles.stat, background: "#ffccc7" }}>
                  <h2>{stats.pending}</h2>
                  <p>Pending</p>
                </div>

                <div style={{ ...styles.stat, background: "#ffe58f" }}>
                  <h2>{stats.inProgress}</h2>
                  <p>In Progress</p>
                </div>

                <div style={{ ...styles.stat, background: "#b7eb8f" }}>
                  <h2>{stats.completed}</h2>
                  <p>Completed</p>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ================= MANAGER ================= */}
      {user.role === "Manager" && (
        <>
          <h3>📊 Manager Dashboard</h3>

          <div style={styles.statBox}>
            {loading ? (
              <p>Loading stats...</p>
            ) : (
              <>
                <div style={styles.stat}>
                  <h2>{stats.projects}</h2>
                  <p>Projects</p>
                </div>

                <div style={styles.stat}>
                  <h2>{stats.tasks}</h2>
                  <p>Tasks</p>
                </div>
                    {/* ✅ NEW: Manager Task Breakdown */}
                <div style={{ ...styles.stat, background: "#ffccc7" }}>
                  <h2>{stats.pending}</h2>
                  <p>Pending</p>
                </div>

                <div style={{ ...styles.stat, background: "#ffe58f" }}>
                  <h2>{stats.inProgress}</h2>
                  <p>In Progress</p>
                </div>

                <div style={{ ...styles.stat, background: "#b7eb8f" }}>
                  <h2>{stats.completed}</h2>
                  <p>Completed</p>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ================= EMPLOYEE ================= */}
      {user.role === "Employee" && (
        <>
          <h3>🧑‍💻 Employee Dashboard</h3>

          <div style={styles.statBox}>
            {loading ? (
              <p>Loading tasks...</p>
            ) : (
              <div style={styles.stat}>
                <h2>{stats.tasks}</h2>
                <p>My Assigned Tasks</p>
              </div>
            )}
          </div>
              {/* ✅ NEW: Employee Task Breakdown */}
                <div style={{ ...styles.stat, background: "#ffccc7" }}>
                  <h2>{stats.pending}</h2>
                  <p>Pending</p>
                </div>

                <div style={{ ...styles.stat, background: "#ffe58f" }}>
                  <h2>{stats.inProgress}</h2>
                  <p>In Progress</p>
                </div>

                <div style={{ ...styles.stat, background: "#b7eb8f" }}>
                  <h2>{stats.completed}</h2>
                  <p>Completed</p>
                </div>
        </>
      )}

       <hr />

    {user.role === "Admin" && (
      <div>
        <h3>🛠 Admin Panel</h3>
        <ul>
          <li>Manage Users</li>
          <li>Create Companies</li>
          <li>Assign Roles</li>
          <li>View All Projects</li>
        </ul>
      </div>
    )}

    {user.role === "Manager" && (
      <div>
        <h3>📊 Manager Panel</h3>
        <ul>
          <li>Create Projects</li>
          <li>Assign Tasks</li>
          <li>Track Progress</li>
          <li>View Team Tasks</li>
        </ul>
      </div>
    )}

    {user.role === "Employee" && (
      <div>
        <h3>🧑‍💻 Employee Panel</h3>
        <ul>
          <li>View Assigned Tasks</li>
          <li>Update Task Status</li>
          <li>Track Personal Work</li>
        </ul>
      </div>
    )}

    </div>
  );
}

export default Dashboard;