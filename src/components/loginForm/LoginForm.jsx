import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import { AuthService } from '../../services/AuthService.js';
import Logo from "../../assets/logoPositive.svg";

import './LoginForm.css';

const LoginForm = ({ onSuccess, onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔍 Intentando login con:', formData);
      
      const user = await AuthService.login(formData);
      
      if (!user || (!user.token && !user.username)) {
        throw new Error('El servidor no devolvió datos de usuario válidos');
      }
      
      if (onSuccess) {
        onSuccess(user);
      }

    } catch (err) {
      console.error('❌ Error en login:', err);
      setErrors({ 
        submit: err.response?.data?.message || err.message || 'Error al iniciar sesión' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="form-header">
        <div className="sidebar-header">
          <Link to="/login">
            <img src={Logo} alt="logotype" className="logo" />
          </Link>
        </div>
        <div className="welcome-section">
          <h2 className="welcome-title">Bienvenido de nuevo</h2>
          <p className="welcome-subtitle">
            Ingresa a tu cuenta para empezar a gestionar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <Input
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange('email')}
          icon={Mail}
          error={errors.email}
          required
        />

        <Input
          type="password"
          label="Contraseña"
          placeholder="********"
          value={formData.password}
          onChange={handleChange('password')}
          icon={Lock}
          error={errors.password}
          showPasswordToggle
          required
        />

        <div className="form-options">
          <button type="button" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {errors.submit && (
          <div className="form-error">
            {errors.submit}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="medium"
          fullWidth={true}
          loading={isLoading}
          icon={ArrowRight}
          iconPosition="right"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="form-footer">
        <span className="toggle-text">¿No tienes cuenta?</span>
        <button
          type="button"
          className="toggle-button"
          onClick={onToggleMode}
        >
          Regístrate gratis
        </button>
      </div>
    </div>
  );
};

export default LoginForm;