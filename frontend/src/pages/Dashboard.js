import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

function Dashboard() {
  const { user } = useContext(AuthContext);

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
    },
    stat: {
      flex: 1,
      padding: "20px",
      background: "#e3e3e3",
      borderRadius: "10px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      
      {/* 👋 Welcome */}
      <h1 style={styles.title}>
        Welcome, {user?.name} 👋
      </h1>

      {/* 👤 Profile */}
      <div style={styles.card}>
        <h3>Profile</h3>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      {/* 📊 Stats */}
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

    </div>
  );
}

export default Dashboard;