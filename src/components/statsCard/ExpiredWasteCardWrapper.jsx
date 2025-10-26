import React, { useState, useEffect } from 'react';
import { getAllWaste } from '../../services/wasteService';
import StatsCard from './StatsCard';

const ExpiredWasteCardWrapper = () => {
  const [expiredData, setExpiredData] = useState({ count: 0, quantity: 0 });
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    fetchWasteData();
  }, []);

  const fetchWasteData = async () => {
    try {
      const data = await getAllWaste();
      calculateExpiredMetrics(data);
    } catch (error) {
      console.error('Error fetching waste data for expired card:', error);
    }
  };

  const calculateExpiredMetrics = (wasteItems) => {
    // Filtrar solo desperdicios por caducidad
    const expiredWastes = wasteItems.filter(item => 
      item.reason === 'caducidad'
    );

    // Calcular métricas del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthExpired = expiredWastes
      .filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate.getMonth() === currentMonth && 
               itemDate.getFullYear() === currentYear;
      });

    const currentQuantity = currentMonthExpired.reduce((sum, item) => sum + item.quantity, 0);
    const currentCount = currentMonthExpired.length;

    // Calcular métricas del mes anterior para la tendencia
    const lastMonthExpired = expiredWastes
      .filter(item => {
        const itemDate = new Date(item.timestamp);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const year = currentMonth === 0 ? currentYear - 1 : currentYear;
        return itemDate.getMonth() === lastMonth && 
               itemDate.getFullYear() === year;
      });

    const lastMonthQuantity = lastMonthExpired.reduce((sum, item) => sum + item.quantity, 0);

    setExpiredData({
      count: currentCount,
      quantity: currentQuantity
    });

    // Calcular tendencia
    if (lastMonthQuantity > 0) {
      const change = ((currentQuantity - lastMonthQuantity) / lastMonthQuantity) * 100;
      setTrend({
        isPositive: change < 0, // Menos caducados = positivo
        text: `${Math.abs(Math.round(change))}% vs mes pasado`
      });
    }
  };

  return (
    <StatsCard
      title="Productos Caducados"
      value={expiredData.count}
      subtitle={`${expiredData.quantity.toFixed(1)} kg este mes`}
      icon="📅"
      trend={trend}
      variant={trend?.isPositive ? 'success' : 'danger'}
    />
  );
};

export default ExpiredWasteCardWrapper;