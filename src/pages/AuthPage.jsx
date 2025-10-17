import React, { useState, useEffect } from 'react';
import LoginForm from '../components/loginForm/LoginForm.jsx';
import RegisterForm from '../components/registerForm/RegisterForm.jsx';
import DashboardPreview from '../components/preview/Preview.jsx';
import './AuthPage.css';

const AuthPage = ({ onUserAuthenticated }) => {
  const [authMode, setAuthMode] = useState('login');

  // Verificar si ya hay un usuario logueado al cargar la página
//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     if (currentUser && onUserAuthenticated) {
//       onUserAuthenticated(currentUser);
//     }
//   }, [onUserAuthenticated]);

  const handleAuthSuccess = (user) => {
    console.log('Usuario autenticado:', user);
    
    // Notificar al componente padre que el usuario se autenticó
    if (onUserAuthenticated) {
      onUserAuthenticated(user);
    } else {
      // Fallback: redirigir al dashboard o mostrar mensaje
      console.log('Redireccionar al dashboard...');
      alert(`¡Bienvenido ${user.username}! Redirigiendo al dashboard...`);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <div className="auth-page">
      {/* Left Side - Preview del Dashboard */}
      <div className="auth-preview-section">
        <DashboardPreview />
      </div>

      {/* Right Side - Formularios de Auth */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          {authMode === 'login' ? (
            <LoginForm 
              onSuccess={handleAuthSuccess}
              onToggleMode={toggleAuthMode}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess}
              onToggleMode={toggleAuthMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;