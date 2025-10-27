import React, { useState, useEffect } from 'react';
import { getAnalyticsStats } from '../../services/analyticsService';
import StatsCard from '../statsCard/StatsCard';

const ExpiredWasteCardWrapper = () => {
  const [data, setData] = useState({ count: 0, quantity: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const stats = await getAnalyticsStats();
      
      setData({
        count: stats.expiredCount || 0,
        quantity: stats.expiredWaste || 0
      });
    } catch (error) {
      console.error('Error fetching expired waste stats:', error);
      setData({ count: 0, quantity: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <StatsCard
        title="Productos Caducados"
        value="Cargando..."
        subtitle="kg este mes"
        icon="📅"
        variant="default"
      />
    );
  }

  return (
    <StatsCard
      title="Productos Caducados"
      value={data.count}
      subtitle={`${data.quantity} kg este mes`}
      icon="📅"
      variant="info"
    />
  );
};

export default ExpiredWasteCardWrapper;