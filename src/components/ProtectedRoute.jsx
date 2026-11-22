import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
