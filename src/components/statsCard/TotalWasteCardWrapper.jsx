import React, { useState, useEffect } from 'react';
import { getAnalyticsStats } from '../../services/analyticsService';
import StatsCard from '../statsCard/StatsCard';

const TotalWasteCardWrapper = () => {
  const [data, setData] = useState({ value: 0, trend: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const stats = await getAnalyticsStats();
      
      setData({
        value: stats.totalWaste || 0,
        trend: {
          isPositive: false, // Siempre negativo porque es desperdicio
          text: `${stats.totalWaste || 0} kg este mes`
        }
      });
    } catch (error) {
      console.error('Error fetching total waste stats:', error);
      setData({
        value: 0,
        trend: { isPositive: false, text: 'Error cargando datos' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <StatsCard
        title="Desperdicio Total"
        value="Cargando..."
        subtitle="Este mes"
        icon="🗑️"
        variant="default"
      />
    );
  }

  return (
    <StatsCard
      title="Desperdicio Total"
      value={`${data.value} kg`}
      subtitle="Este mes"
      icon="🗑️"
      trend={data.trend}
      variant="danger"
    />
  );
};

export default TotalWasteCardWrapper;