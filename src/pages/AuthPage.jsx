import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/loginForm/LoginForm.jsx';
import RegisterForm from '../components/registerForm/RegisterForm.jsx';
import DashboardPreview from '../components/preview/Preview.jsx';
import { AuthService } from '../services/AuthService.js';

import './AuthPage.css';

const AuthPage = ({ onUserAuthenticated = null }) => {
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/register') {
      setAuthMode('register');
    } else {
      setAuthMode('login');
    }
  }, [location.pathname]);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && (currentUser.token || currentUser.username)) {
      navigate('/dashboard', { replace: true });
    }
  }, []); 

  const handleAuthSuccess = (user) => {
    console.log('Usuario autenticado:', user);
    
    if (!user || (!user.token && !user.username)) {
      console.error('Error: Usuario autenticado sin datos válidos', user);
      return;
    }
    
    if (onUserAuthenticated) {
      onUserAuthenticated(user);
    }
    
    setTimeout(() => {
      console.log('🔄 Redirigiendo a /stock');
      navigate('/stock', { replace: true });
    }, 100);
  };

  const toggleAuthMode = () => {
    const newMode = authMode === 'login' ? 'register' : 'login';
    setAuthMode(newMode);
    
    navigate(newMode === 'login' ? '/login' : '/register', { replace: true });
  };

  return (
    <div className="auth-page">
      {/* Left Side - Preview del Dashboard */}
      <div className="auth-preview-section">
        <DashboardPreview />
      </div>

      {/* Right Side - Formularios de Auth */}
      <div className="auth-form-section">
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
  );
};

export default AuthPage;