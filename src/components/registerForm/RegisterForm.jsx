import React, { useState } from 'react';
import { User, ChefHat, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import { AuthService } from '../../services/AuthService.js';
import Logo from "../../assets/logoPositive.svg";
import './RegisterForm.css';

const RegisterForm = ({ onSuccess, onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username required';
    if (!formData.email) newErrors.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const user = await AuthService.register(formData);
      onSuccess?.(user);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || err.message });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="register-form">
      <div className="form-header">
          <div className="sidebar-header">
                        <Link to="/dashboard">
                            <img src={Logo} alt="logotype" className="logo" />
                        </Link>
                    </div>
        <div className="welcome-section">
          <h2 className="welcome-title">Empieza ahora</h2>
          <p className="welcome-subtitle">
            Crea tu cuenta y transforma la gestión 
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">

        <Input
          type="text"
          label="Nombre de Usuario"
          placeholder="Usuario123"
          value={formData.username}
          onChange={handleChange('username')}
          icon={ChefHat}
          error={errors.username}
          required
        />

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

        <Input
          type="password"
          label="Confirmar Contraseña"
          placeholder="********"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          icon={Lock}
          error={errors.confirmPassword}
          showPasswordToggle
          required
        />

        {errors.submit && (
          <div className="form-error">
            {errors.submit}
          </div>
        )}

        <div className="terms-notice">
          <p>Al crear una cuenta, aceptas nuestros{' '}
            <a href="#" className="terms-link">Términos de Servicio</a> y{' '}
            <a href="#" className="terms-link">Política de Privacidad</a>
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          loading={isLoading}
          icon={ArrowRight}
          iconPosition="right"
          fullWidth={true}
        >
          Crear Cuenta
        </Button>
      </form>

      <div className="form-footer">
        <span className="toggle-text">¿Ya tienes cuenta?</span>
        <button
          type="button"
          className="toggle-button"
          onClick={onToggleMode}
        >
          Inicia sesión
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;