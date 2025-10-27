import React, { useState, useEffect } from 'react';
import { getAnalyticsStats } from '../../services/analyticsService';
import StatsCard from '../statsCard/StatsCard';

const CookingErrorsCardWrapper = () => {
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
        count: stats.cookingErrorsCount || 0,
        quantity: stats.cookingErrorsWaste || 0
      });
    } catch (error) {
      console.error('Error fetching cooking errors stats:', error);
      setData({ count: 0, quantity: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <StatsCard
        title="Errores Elaboración"
        value="Cargando..."
        subtitle="kg este mes"
        icon="👨‍🍳"
        variant="default"
      />
    );
  }

  return (
    <StatsCard
      title="Errores Elaboración"
      value={data.count}
      subtitle={`${data.quantity} kg este mes`}
      icon="👨‍🍳"
      variant="warning"
    />
  );
};

export default CookingErrorsCardWrapper;