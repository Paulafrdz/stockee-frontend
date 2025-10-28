import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import AuthPage from "../pages/AuthPage";
import StockPage from "../pages/StockPage";
import OrdersPage from "../pages/OrdersPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import DashboardPage from "../pages/DashboardPage";

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
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/stock"
        element={
          <PrivateRoute>
            <StockPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/order"
        element={
          <PrivateRoute>
            <OrdersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <AnalyticsPage />
          </PrivateRoute>
        }
      />
      
      {/* Redirect root to stock page for authenticated users, login for non-authenticated */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 - Redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}