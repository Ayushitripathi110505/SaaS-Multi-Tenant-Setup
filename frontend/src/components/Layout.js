import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
    },
    content: {
      flex: 1,
      padding: "20px",
      background: "#f9f9f9",
    },
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}

export default Layout;