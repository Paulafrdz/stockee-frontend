import React, { useState, useEffect } from 'react';
import { getAnalyticsStats } from '../../services/analyticsService';
import StatsCard from '../statsCard/StatsCard';

const EfficiencyCardWrapper = () => {
  const [efficiency, setEfficiency] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const stats = await getAnalyticsStats();
      
      setEfficiency(stats.efficiency || 0);
    } catch (error) {
      console.error('Error fetching efficiency stats:', error);
      setEfficiency(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getVariant = (eff) => {
    if (eff >= 90) return 'success';
    if (eff >= 80) return 'warning';
    return 'danger';
  };

  const getTrend = (eff) => {
    if (eff >= 90) return { isPositive: true, text: "Excelente" };
    if (eff >= 80) return { isPositive: true, text: "Bueno" };
    return { isPositive: false, text: "Necesita mejora" };
  };

  if (isLoading) {
    return (
      <StatsCard
        title="Eficiencia General"
        value="Cargando..."
        subtitle="Uso vs Desperdicio"
        icon="📊"
        variant="default"
      />
    );
  }

  return (
    <StatsCard
      title="Eficiencia General"
      value={`${efficiency}%`}
      subtitle="Uso vs Desperdicio"
      icon="📊"
      trend={getTrend(efficiency)}
      variant={getVariant(efficiency)}
    />
  );
};

export default EfficiencyCardWrapper;