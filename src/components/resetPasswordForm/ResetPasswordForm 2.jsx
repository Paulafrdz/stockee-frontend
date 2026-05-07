import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import Logo from '../../assets/logoPositive.svg';
import './ResetPasswordForm.css';

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.newPassword) {
            newErrors.newPassword = 'La contraseña es requerida';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mínimo 6 caracteres';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'La contraseña no coincide';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            await axios.post('http://localhost:8080/api/auth/reset-password', {
                token,
                newPassword: formData.newPassword
            });
            setDone(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setErrors({
                submit: err.response?.data?.message || 'El enlace no es válido o ha expirado.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    //No se ha encontrado token en la URL
    if (!token) {
        return (
            <div className="rp-form">
                <div className="form-header">
                    <div className="sidebar-header-logo">
                        <Link to="/login">
                            <img src={Logo} alt="logotype" className="logo" />
                        </Link>
                    </div>
                    <div className="welcome-section">
                        <h2 className="welcome-title">Enlace no válido</h2>
                        <p className="welcome-subtitle">
                            Este enlace no es válido. Solicita uno nuevo desde la pantalla de inicio de sesión.
                        </p>
                    </div>
                </div>
                <div className="form-footer">
                    <Link to="/login" className="toggle-button">Volver al inicio de sesión</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rp-form">
            <div className="form-header">
                <div className="sidebar-header-logo">
                    <Link to="/login">
                        <img src={Logo} alt="logotype" className="logo" />
                    </Link>
                </div>
                <div className="welcome-section">
                    <h2 className="welcome-title">
                        {done ? '¡Contraseña actualizada!' : 'Nueva contraseña'}
                    </h2>
                    <p className="welcome-subtitle">
                        {done
                            ? 'Tu contraseña se ha cambiado correctamente. Redirigiendo al inicio de sesión...'
                            : 'Introduce tu nueva contraseña.'}
                    </p>
                </div>
            </div>

            {!done && (
                <form onSubmit={handleSubmit} className="form-flex">
                    <Input
                        type="password"
                        label="Nueva contraseña"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.newPassword}
                        onChange={handleChange('newPassword')}
                        icon={Lock}
                        error={errors.newPassword}
                        showPasswordToggle
                        required
                    />

                    <Input
                        type="password"
                        label="Confirmar contraseña"
                        placeholder="Repite la contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        icon={Lock}
                        error={errors.confirmPassword}
                        showPasswordToggle
                        required
                    />

                    {errors.submit && (
                        <div className="form-error">{errors.submit}</div>
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
                        {isLoading ? 'Guardando...' : 'Guardar contraseña'}
                    </Button>
                </form>
            )}

            {!done && (
                <div className="form-footer">
                    <span className="toggle-text">¿Recuerdas tu contraseña?</span>
                    <Link to="/login" className="toggle-button">Inicia sesión</Link>
                </div>
            )}
        </div>
    );
}

export default ResetPasswordForm;