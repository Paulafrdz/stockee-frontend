import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

export default function PrivateRoute({ children }) {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}