import React, { useState, useEffect } from 'react';
import { getWasteTrendData } from '../../services/analyticsService';
import WasteTrendChart from '../wasteTrendChart/WasteTrendChart';

const WasteTrendChartWrapper = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getWasteTrendData();
      setChartData(data);
    } catch (error) {
      console.error('Error fetching waste trend data:', error);
      setError('Error al cargar datos de tendencias');
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="chart-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tendencias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-error">
        <p>⚠️ {error}</p>
        <button onClick={fetchData} className="retry-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return <WasteTrendChart data={chartData} />;
};

export default WasteTrendChartWrapper;