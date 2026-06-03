import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { io } from "socket.io-client";

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "white",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  user: {
    fontSize: "14px",
  },
  button: {
    padding: "5px 10px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#ff4d4d",
    color: "white",
    borderRadius: "4px",
  },
  notifBox: {
    position: "relative",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "25px",
    right: "0",
    backgroundColor: "white",
    color: "black",
    width: "250px",
    borderRadius: "6px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    padding: "10px",
    zIndex: 10,
  },
  notifItem: {
    padding: "5px",
    borderBottom: "1px solid #eee",
  },
};

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
  if (!user) return;

  fetchNotifications();

  const socket = io("http://localhost:5000");

  socket.emit("join", user._id);

  socket.on("newNotification", (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  });

  return () => {
    socket.disconnect();
  };
}, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      <h2>SaaS Dashboard</h2>

      <div style={styles.right}>
        {user && (
          <div style={styles.notifBox}>
            <span onClick={() => setOpen(!open)}>
              🔔 Notifications ({notifications.filter((n) => !n.read).length})
            </span>

            {open && (
              <div style={styles.dropdown}>
                {notifications.length === 0 ? (
                  <p>No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} style={styles.notifItem}>
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {user ? (
          <>
            <span style={styles.user}>
              {user.name} ({user.role})
            </span>

            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </div>
  );
}

export default Navbar;