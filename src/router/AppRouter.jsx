import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import AuthPage from "../pages/AuthPage";
import StockPage from "../pages/StockPage";

export default function AppRouter({ onUserAuthenticated }) {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage onUserAuthenticated={onUserAuthenticated} />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthPage onUserAuthenticated={onUserAuthenticated} />
          </PublicRoute>
        }
      />

      {/* PRIVATE ROUTES */}
      <Route
        path="/stock"
        element={
          <PrivateRoute>
            <StockPage />
          </PrivateRoute>
        }
      />
      

      {/* Redirect root to stock page for authenticated users, login for non-authenticated */}
      <Route path="/" element={<Navigate to="/stock" replace />} />
      
      {/* 404 - Redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}