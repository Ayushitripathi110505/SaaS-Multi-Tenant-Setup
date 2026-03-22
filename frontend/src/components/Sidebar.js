import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const { user } = useContext(AuthContext);

  const styles = {
    sidebar: {
      width: "220px",
      background: "#1f2937",
      color: "white",
      padding: "20px",
    },
    link: {
      display: "block",
      color: "white",
      textDecoration: "none",
      margin: "10px 0",
    },
    title: {
      marginBottom: "20px",
    },
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>🚀 SaaS App</h2>

      <Link style={styles.link} to="/dashboard">Dashboard</Link>

      {/* Admin */}
      {user?.role === "Admin" && (
        <>
          <Link style={styles.link} to="/users">Users</Link>
          <Link style={styles.link} to="/projects">Projects</Link>
          <Link style={styles.link} to="/tasks">Tasks</Link>
        </>
      )}

      {/* Manager */}
      {user?.role === "Manager" && (
        <>
          <Link style={styles.link} to="/projects">Projects</Link>
          <Link style={styles.link} to="/tasks">Tasks</Link>
        </>
      )}

      {/* Employee */}
      {user?.role === "Employee" && (
        <>
          <Link style={styles.link} to="/tasks">My Tasks</Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;