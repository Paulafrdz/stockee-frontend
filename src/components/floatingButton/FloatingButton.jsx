import React from 'react';
import './FloatingButton.css';

const FloatingButton = ({
  children,
  icon: Icon,
  variant = 'primary',
  size = 'medium',
  position = 'bottom-right',
  disabled = false,
  loading = false,
  tooltip,
  onClick,
  className = '',
  ...props
}) => {
  const fabClasses = [
    'fab',
    `fab-${variant}`,
    `fab-${size}`,
    `fab-${position}`,
    disabled && 'fab-disabled',
    loading && 'fab-loading',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type="button"
      className={fabClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={tooltip || 'Floating action button'}
      title={tooltip}
      {...props}
    >
      {loading ? (
        <div className="fab-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {Icon && <Icon className="fab-icon" />}
          {children && <span className="fab-text">{children}</span>}
        </>
      )}
    </button>
  );
};

export default FloatingButton;