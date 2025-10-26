import React, { useState, useEffect } from 'react';
import { getAllWaste } from '../../services/wasteService';
import StatsCard from './StatsCard';

const CookingErrorsCardWrapper = () => {
  const [cookingErrorsData, setCookingErrorsData] = useState({ count: 0, quantity: 0 });
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    fetchWasteData();
  }, []);

  const fetchWasteData = async () => {
    try {
      const data = await getAllWaste();
      calculateCookingErrorsMetrics(data);
    } catch (error) {
      console.error('Error fetching waste data for cooking errors card:', error);
    }
  };

  const calculateCookingErrorsMetrics = (wasteItems) => {
    // Filtrar solo errores de elaboración
    const cookingErrors = wasteItems.filter(item => 
      item.reason === 'quemado' || 
      item.reason === 'ingrediente-incorrecto' ||
      item.reason === 'preparacion-excesiva'
    );

    // Calcular métricas del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthErrors = cookingErrors
      .filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate.getMonth() === currentMonth && 
               itemDate.getFullYear() === currentYear;
      });

    const currentQuantity = currentMonthErrors.reduce((sum, item) => sum + item.quantity, 0);
    const currentCount = currentMonthErrors.length;

    // Calcular métricas del mes anterior para la tendencia
    const lastMonthErrors = cookingErrors
      .filter(item => {
        const itemDate = new Date(item.timestamp);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const year = currentMonth === 0 ? currentYear - 1 : currentYear;
        return itemDate.getMonth() === lastMonth && 
               itemDate.getFullYear() === year;
      });

    const lastMonthQuantity = lastMonthErrors.reduce((sum, item) => sum + item.quantity, 0);

    setCookingErrorsData({
      count: currentCount,
      quantity: currentQuantity
    });

    // Calcular tendencia
    if (lastMonthQuantity > 0) {
      const change = ((currentQuantity - lastMonthQuantity) / lastMonthQuantity) * 100;
      setTrend({
        isPositive: change < 0, // Menos errores = positivo
        text: `${Math.abs(Math.round(change))}% vs mes pasado`
      });
    }
  };

  return (
    <StatsCard
      title="Errores Elaboración"
      value={cookingErrorsData.count}
      subtitle={`${cookingErrorsData.quantity.toFixed(1)} kg este mes`}
      icon="👨‍🍳"
      trend={trend}
      variant={trend?.isPositive ? 'success' : 'warning'}
    />
  );
};

export default CookingErrorsCardWrapper;