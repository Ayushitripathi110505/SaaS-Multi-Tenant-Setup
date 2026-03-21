import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // 🔒 If not logged in → redirect
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ If logged in → show page
  return children;
}

export default ProtectedRoute;