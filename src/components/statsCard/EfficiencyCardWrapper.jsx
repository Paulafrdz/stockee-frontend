import React, { useState, useEffect } from 'react';
import { getAllWaste } from '../../services/wasteService';
import { getStockItems } from '../../services/stockService';
import StatsCard from './StatsCard';

const EfficiencyCardWrapper = () => {
  const [efficiency, setEfficiency] = useState(0);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    calculateEfficiency();
  }, []);

  const calculateEfficiency = async () => {
    try {
      const [wasteData, stockData] = await Promise.all([
        getAllWaste(),
        getStockItems()
      ]);

      // Calcular uso total (stock actual + desperdicios)
      const totalUsage = stockData.reduce((sum, item) => sum + item.currentStock, 0) +
                        wasteData.reduce((sum, item) => sum + item.quantity, 0);

      // Calcular eficiencia
      const wastePercentage = totalUsage > 0 ? 
        (wasteData.reduce((sum, item) => sum + item.quantity, 0) / totalUsage) * 100 : 0;
      
      const currentEfficiency = Math.max(0, 100 - wastePercentage);
      setEfficiency(currentEfficiency);

      // Aquí podrías calcular tendencia comparando con periodo anterior
      setTrend({
        isPositive: currentEfficiency >= 80,
        text: currentEfficiency >= 80 ? "Buen nivel" : "Necesita mejora"
      });

    } catch (error) {
      console.error('Error calculating efficiency:', error);
    }
  };

  return (
    <StatsCard
      title="Eficiencia General"
      value={`${Math.round(efficiency)}%`}
      subtitle="Uso vs Desperdicio"
      icon="📊"
      trend={trend}
      variant={efficiency >= 80 ? 'success' : efficiency >= 60 ? 'warning' : 'danger'}
    />
  );
};