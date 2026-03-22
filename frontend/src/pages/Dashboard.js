import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    users: 0,
  });

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