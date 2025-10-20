import React from 'react';
import './MainContent.css';

const MainContent = ({ children}) => {
  return (
    
        
        <div className="content-body">
          {children}
        </div>
      

  );
};

export default MainContent;