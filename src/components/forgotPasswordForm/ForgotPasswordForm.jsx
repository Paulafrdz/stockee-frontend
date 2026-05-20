import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import Logo from '../../assets/logoPositive.svg';
import './ForgotPasswordForm.css';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (value) => {
        if (!value) return 'El email es requerido';
        if (!/\S+@\S+\.\S+/.test(value)) return 'El email no es válido';
        return '';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
                { email }
            );
            setSent(true);
        } catch (err) {
            setSent(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fp-form">
            <div className="form-header">
                <div className="sidebar-header-logo">
                    <Link to="/login">
                        <img src={Logo} alt="logotype" className="logo" />
                    </Link>
                </div>

                <div className="welcome-section">
                    <h2 className="welcome-title">
                        {sent ? '¡Correo enviado!' : 'Recuperar contraseña'}
                    </h2>
                    <p className="welcome-subtitle">
                        {sent
                            ? `Si ${email} está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos.`
                            : 'Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.'
                        }
                    </p>
                </div>
            </div>

            {!sent && (
                <form onSubmit={handleSubmit} className="form-flex">
                    <Input
                        type="email"
                        label="Email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                        icon={Mail}
                        error={error}
                        required
                    />

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
                        {isLoading ? 'Enviado...' : 'Enviar enlace'}
                    </Button>
                </form>
            )}

            <div className="form-footer">
                <Link to="/login" className="fp-back-link">
                    <ArrowLeft size={14} />
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;