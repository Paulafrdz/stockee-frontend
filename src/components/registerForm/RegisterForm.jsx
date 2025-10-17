import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User, ChefHat } from 'lucide-react';
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import './RegisterForm.css';

const RegisterForm = ({ onSubmit, onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'El nombre de usuario es requerido';
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = 'El nombre de usuario debe tener al menos 2 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await onSubmit?.(formData);
    } catch (error) {
      setErrors({ submit: 'Error al crear la cuenta. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form">
      <div className="form-header">
        
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
          label="Nombre Completo"
          placeholder="Juan Pérez"
          value={formData.name}
          onChange={handleChange('name')}
          icon={User}
          error={errors.name}
          required
        />

        <Input
          type="text"
          label="Nombre de Usuario"
          placeholder="Usuario123"
          value={formData.userName}
          onChange={handleChange('userName')}
          icon={ChefHat}
          error={errors.userName}
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
          fullWidth
          loading={isLoading}
          icon={ArrowRight}
          iconPosition="right"
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