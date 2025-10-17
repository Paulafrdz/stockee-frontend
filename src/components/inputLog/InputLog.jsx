import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './InputLog.css';

const InputLog = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className={`input-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      
      <div className={`input-wrapper ${isFocused ? 'focused' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        {Icon && (
          <Icon className="input-icon input-icon-left" />
        )}
        
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`input-field ${Icon ? 'has-left-icon' : ''} ${showPasswordToggle ? 'has-right-icon' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            className="input-icon input-icon-right password-toggle"
            onClick={handlePasswordToggle}
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {error && (
        <span className="input-error">{error}</span>
      )}
    </div>
  );
};

export default InputLog;