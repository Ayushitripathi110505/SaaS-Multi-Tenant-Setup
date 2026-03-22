import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const styles = {
    sidebar: {
      width: "220px",
      background: "#1f2937",
      color: "white",
      padding: "20px",
      minHeight: "100vh",
    },
    link: {
      display: "block",
      color: "white",
      textDecoration: "none",
      margin: "10px 0",
      padding: "8px",
      borderRadius: "5px",
    },
    active: {
      background: "#374151",
    },
    title: {
      marginBottom: "20px",
    },
  };

  const isActive = (path) =>
    location.pathname === path ? styles.active : {};

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>🚀 SaaS App</h2>

      <Link style={{ ...styles.link, ...isActive("/dashboard") }} to="/dashboard">
        Dashboard
      </Link>

      {/* Admin */}
      {user?.role === "Admin" && (
        <>
          <Link style={{ ...styles.link, ...isActive("/users") }} to="/users">
            Users
          </Link>
          <Link style={{ ...styles.link, ...isActive("/projects") }} to="/projects">
            Projects
          </Link>
          <Link style={{ ...styles.link, ...isActive("/tasks") }} to="/tasks">
            Tasks
          </Link>
        </>
      )}

      {/* Manager */}
      {user?.role === "Manager" && (
        <>
          <Link style={{ ...styles.link, ...isActive("/projects") }} to="/projects">
            Projects
          </Link>
          <Link style={{ ...styles.link, ...isActive("/tasks") }} to="/tasks">
            Tasks
          </Link>
        </>
      )}

      {/* Employee */}
      {user?.role === "Employee" && (
        <Link style={{ ...styles.link, ...isActive("/tasks") }} to="/tasks">
          My Tasks
        </Link>
      )}
    </div>
  );
}

export default Sidebar;