import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

export default function PrivateRoute({ children }) {
  const isAuthenticated = AuthService.isAuthenticated();
  
  console.log('🔍 PrivateRoute - isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('🔄 No autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ Usuario autenticado, mostrando contenido');
  return children;
}