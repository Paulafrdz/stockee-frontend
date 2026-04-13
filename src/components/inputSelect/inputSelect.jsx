import { ChevronDown } from 'lucide-react';
import './inputSelect.css';

const inputSelect = ({
    label,
    value,
    onChange,
    disabled = false,
    required = false,
    error,
    className = '',
    children,
    ...props
}) => {
    return (
        <div className={`is-group ${className}`}>
            {label && (
                <label className={`is-label ${required ? 'required' : ''}`}>
                    {label}
                </label>
            )}

            <div className={`is-wrapper ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
                <select
                    className="is-field"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    {...props}
                >
                    {children}
                </select>
                <ChevronDown size={16} className="is-icon" />
            </div>

            {error && (
                <span className="is-error">{error}</span>
            )}
        </div>
    );
};

export default inputSelect;