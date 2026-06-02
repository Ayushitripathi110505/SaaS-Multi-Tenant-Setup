import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
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

      <div style={styles.main}>
        <Navbar />

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;