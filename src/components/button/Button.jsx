import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled && 'btn-disabled',
    loading && 'btn-loading',
    fullWidth && 'btn-full-width',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="btn-spinner">
          <div className="spinner"></div>
        </div>
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="btn-icon btn-icon-left" />
      )}
      
      <span className={`btn-text ${loading ? 'btn-text-loading' : ''}`}>
        {children}
      </span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="btn-icon btn-icon-right" />
      )}
    </button>
  );
};

export default Button;