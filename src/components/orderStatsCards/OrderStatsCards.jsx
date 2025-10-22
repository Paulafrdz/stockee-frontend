import React from 'react';
import { Package, Clock, AlertCircle } from 'lucide-react';
import './OrderStatsCards.css';

const OrderStatsCards = ({ stats }) => {
  const {
    pendingOrders = 0,
    nextOrderDate = null,
    urgentIngredients = 0
  } = stats;

  // Format next order date
  const formatNextOrderDate = (date) => {
    if (!date) return 'Not scheduled';
    
    const orderDate = new Date(date);
    const today = new Date();
    const diffTime = orderDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `In ${diffDays} days`;
    
    return orderDate.toLocaleDateString();
  };

  const statsData = [
    {
      id: 'pending',
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Package,
      color: 'blue',
      description: 'Orders waiting processing'
    },
    {
      id: 'next-order',
      title: 'Next Order',
      value: formatNextOrderDate(nextOrderDate),
      icon: Clock,
      color: 'green',
      description: 'Scheduled delivery'
    },
    {
      id: 'urgent',
      title: 'Urgent Ingredients',
      value: urgentIngredients,
      icon: AlertCircle,
      color: urgentIngredients > 0 ? 'red' : 'gray',
      description: 'Require immediate attention'
    }
  ];

  return (
    <div className="order-stats-cards">
      {statsData.map((stat) => {
        const IconComponent = stat.icon;
        
        return (
          <div key={stat.id} className={`order-stat-card order-stat-card--${stat.color}`}>
            <div className="order-stat-card__icon">
              <IconComponent size={20} />
            </div>
            <div className="order-stat-card__content">
              <div className="order-stat-card__title">{stat.title}</div>
              <div className="order-stat-card__value">{stat.value}</div>
              <div className="order-stat-card__description">{stat.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatsCards;