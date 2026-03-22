import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/tailwind.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ManagerPanel from "./pages/ManagerPanel";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import ProjectDetails from "./pages/ProjectDetails";
import Users from "./pages/Users";
import Layout from "./components/Layout";
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

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
                <Layout>
                 <Dashboard />
                </Layout>
            </ProtectedRoute>
          }
        />

        {/* Projects */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
             </ProtectedRoute>
          }
        />

        {/* Project Details */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
               <Layout>
                <ProjectDetails />
                </Layout>
              
            </ProtectedRoute>
          }
        />

        {/* Tasks */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout>
                 <Tasks />
                </Layout>
             
            </ProtectedRoute>
          }
        />

        {/* Users (Admin) */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <RoleRoute role="Admin">
                <Users />
              </RoleRoute>
              </Layout>
              
            </ProtectedRoute>
          }
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
               <Layout>
                <RoleRoute role="Admin">
                <AdminPanel />
              </RoleRoute>
               </Layout>
              
            </ProtectedRoute>
          }
        />

        {/* Manager Panel */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
               <Layout>
                 <RoleRoute role="Manager">
                <ManagerPanel />
              </RoleRoute>
               </Layout>
             
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;