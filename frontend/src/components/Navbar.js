import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "white"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  user: {
    fontSize: "14px"
  },
  button: {
  padding: "5px 10px",
  cursor: "pointer",
  border: "none",
  backgroundColor: "#ff4d4d",
  color: "white",
  borderRadius: "4px"
}
};
function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();            // clear user + token
    navigate("/login");  // redirect to login
  };

  return (
    <div style={styles.navbar}>
      <h2>SaaS Dashboard</h2>

      <div style={styles.right}>
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