import React, { useState, useEffect } from 'react';
import { getAllWaste } from '../../services/wasteService';
import StatsCard from './StatsCard';

const TotalWasteCardWrapper = () => {
  const [wasteData, setWasteData] = useState([]);
  const [totalWaste, setTotalWaste] = useState(0);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    fetchWasteData();
  }, []);

  const fetchWasteData = async () => {
    try {
      const data = await getAllWaste();
      setWasteData(data);
      calculateWasteMetrics(data);
    } catch (error) {
      console.error('Error fetching waste data for card:', error);
    }
  };

  const calculateWasteMetrics = (wasteItems) => {
    // Calcular desperdicio del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthWaste = wasteItems
      .filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate.getMonth() === currentMonth && 
               itemDate.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + item.quantity, 0);

    // Calcular desperdicio del mes anterior
    const lastMonthWaste = wasteItems
      .filter(item => {
        const itemDate = new Date(item.timestamp);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const year = currentMonth === 0 ? currentYear - 1 : currentYear;
        return itemDate.getMonth() === lastMonth && 
               itemDate.getFullYear() === year;
      })
      .reduce((sum, item) => sum + item.quantity, 0);

    setTotalWaste(currentMonthWaste);

    // Calcular tendencia
    if (lastMonthWaste > 0) {
      const change = ((currentMonthWaste - lastMonthWaste) / lastMonthWaste) * 100;
      setTrend({
        isPositive: change < 0, // Menos desperdicio = positivo
        text: `${Math.abs(Math.round(change))}% vs mes pasado`
      });
    }
  };

  return (
    <StatsCard
      title="Desperdicio Total"
      value={`${totalWaste.toFixed(1)} kg`}
      subtitle="Este mes"
      icon="🗑️"
      trend={trend}
      variant={trend?.isPositive ? 'success' : 'danger'}
    />
  );
};

export default TotalWasteCardWrapper;