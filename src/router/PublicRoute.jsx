import React from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";

export default function PublicRoute({ children }) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
