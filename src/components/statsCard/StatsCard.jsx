// StatsCard.jsx
import React from 'react';
import './StatsCard.css';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  variant = 'default' // 'default', 'success', 'warning', 'danger', 'info'
}) => {
  const getIconClass = () => {
    switch(variant) {
      case 'success':
        return 'stats-card-icon-success';
      case 'warning':
        return 'stats-card-icon-warning';
      case 'danger':
        return 'stats-card-icon-danger';
      case 'info':
        return 'stats-card-icon-info';
      default:
        return 'stats-card-icon-default';
    }
  };

  const getTrendClass = () => {
    if (!trend) return '';
    return trend.isPositive ? 'stats-card-trend-positive' : 'stats-card-trend-negative';
  };

  return (
    <div className="stats-card-container">
      <div className="stats-card-header">
        <div className="stats-card-title-section">
          <span className={`stats-card-icon ${getIconClass()}`}>
            {icon}
          </span>
          <h3 className="stats-card-title">{title}</h3>
        </div>
      </div>

      <div className="stats-card-content">
        <div className="stats-card-value">{value}</div>
        {subtitle && (
          <div className="stats-card-subtitle">
            {trend && (
              <span className={`stats-card-trend ${getTrendClass()}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.text}
              </span>
            )}
            {!trend && <span className="stats-card-subtitle-text">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;