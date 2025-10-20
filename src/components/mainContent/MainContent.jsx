import React from 'react';
import './MainContent.css';

const MainContent = ({ children, title, subtitle }) => {
  return (
    
      <div className="content-container">
        {title && (
          <div className="content-header">
            <h1 className="content-title">{title}</h1>
            {subtitle && (
              <p className="content-subtitle">{subtitle}</p>
            )}
          </div>
        )}
        
        <div className="content-body">
          {children}
        </div>
      </div>

  );
};

export default MainContent;