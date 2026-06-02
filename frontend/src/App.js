import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";

import Start from "./pages/Start";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateCompany from "./pages/CreateCompany";

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

function RoleRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <h2 style={{ padding: "20px" }}>Please login first</h2>;
  }

  if (user.role !== role) {
    return <h2 style={{ padding: "20px" }}>Access Denied ❌</h2>;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-company" element={<CreateCompany />} />

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