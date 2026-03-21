import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ManagerPanel from "./pages/ManagerPanel";

import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// 🔐 Role-based wrapper
function RoleRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role !== role) {
    return <h2 style={{ padding: "20px" }}>Access Denied ❌</h2>;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Projects (All authenticated users) */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        {/* Tasks (All authenticated users) */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* Admin Only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="Admin">
                <AdminPanel />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Manager Only */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <RoleRoute role="Manager">
                <ManagerPanel />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;