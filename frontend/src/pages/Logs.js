import React, { useEffect, useState } from "react";
import API from "../api/api";

function Logs() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/logs");
      setLogs(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h2>📜 Activity Logs</h2>

      {logs.length === 0 ? (
        <p>No logs found</p>
      ) : (
        logs.map((log) => (
          <div
            key={log._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>{log.userId?.name || "Unknown User"}</strong>
            </p>

            <p>{log.action}</p>

            <small>{new Date(log.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Logs;