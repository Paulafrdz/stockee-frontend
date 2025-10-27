import React, { useState, useEffect } from 'react';
import { getWasteTypesData } from '../../services/analyticsService';
import WasteTypesPieChart from '../wasteTypesPieChart/WasteTypesPieChart';

const WasteTypesPieChartWrapper = () => {
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
      const data = await getWasteTypesData();
      setChartData(data);
    } catch (error) {
      console.error('Error fetching waste types data:', error);
      setError('Error al cargar datos del gráfico');
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="chart-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tipos de desperdicio...</p>
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

  return <WasteTypesPieChart data={chartData} />;
};

export default WasteTypesPieChartWrapper;