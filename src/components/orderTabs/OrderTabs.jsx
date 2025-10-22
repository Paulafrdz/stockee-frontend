import React from 'react';
import './OrderTabs.css';

const OrderTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'recommendations',
      label: 'Recomendaciones',
    
    },
    {
      id: 'history',
      label: 'Historial',
    }
  ];

  return (
    <div className="order-tabs">
      <div className="order-tabs__list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`order-tabs__tab ${activeTab === tab.id ? 'order-tabs__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            <span className="order-tabs__label">{tab.label}</span>
            <span className="order-tabs__description">{tab.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderTabs;