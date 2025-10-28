import React, { useState, useEffect } from 'react';
import LowStockChart from './LowStockChart';
import { getStockItems } from '../../services/stockService';
import './LowStockChart.css';

const LowStockChartWrapper = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching stock data from API...');
      const data = await getStockItems();
      console.log('📦 Stock data received:', data);
      
      // Transformar datos según la estructura de tu API
      const transformedData = data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.currentStock || 0, // Usar currentStock de tu API
        unit: item.unit || 'unidades',
        minimumStock: item.minimumStock || 0
      }));
      
      console.log('📊 Transformed data for chart:', transformedData);
      setStockData(transformedData);
      
    } catch (error) {
      console.error('❌ Error loading stock data:', error);
      setError(error.response?.data?.message || 'Error al cargar los datos de stock');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchStockData();
  };

  if (isLoading) {
    return (
      <div className="low-stock-wrapper">
        <div className="low-stock-loading">
          <div className="low-stock-spinner"></div>
          <p>Cargando datos de stock...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="low-stock-wrapper">
        <div className="low-stock-error">
          <p>⚠️ {error}</p>
          <button onClick={handleRetry} className="low-stock-retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <LowStockChart data={stockData} />;
};

export default LowStockChartWrapper;