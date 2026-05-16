// components/wasteGauge/WasteGaugeWrapper.jsx
import React, { useState, useEffect } from 'react';
import WasteGauge from './WasteGauge';
import { getStockItems } from '../../services/stockService';
import { getAllWaste } from '../../services/wasteService';
import './WasteGauge.css';

const WasteGaugeWrapper = () => {
  const [wastePercentage, setWastePercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWasteData();
  }, []);

  const fetchWasteData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data for waste percentage calculation...');
      
      const [stockData, wasteData] = await Promise.all([
        getStockItems(),
        getAllWaste()
      ]);

      console.log('📦 Stock data:', stockData);
      console.log('🗑️ Waste data:', wasteData);

      const calculatedWastePercentage = calculateWastePercentage(stockData, wasteData);
      
      console.log('📊 Calculated waste percentage:', calculatedWastePercentage);
      setWastePercentage(calculatedWastePercentage);
      
    } catch (error) {
      console.error('❌ Error loading waste data:', error);
      setError(error.response?.data?.message || 'Error al calcular el porcentaje de desperdicio');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para calcular el porcentaje de desperdicio
  const calculateWastePercentage = (stockItems, wasteItems) => {
    if (!stockItems.length || !wasteItems.length) {
      return 0; 
    }

    try {
      const totalStockValue = stockItems.reduce((total, item) => {
        return total + (item.currentStock || 0);
      }, 0);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentWaste = wasteItems.filter(waste => {
        const wasteDate = new Date(waste.timestamp);
        return wasteDate >= thirtyDaysAgo;
      });

      const totalWasteValue = recentWaste.reduce((total, waste) => {
        return total + (waste.quantity || 0);
      }, 0);

      console.log('💰 Total stock value:', totalStockValue);
      console.log('🗑️ Recent waste value (30 days):', totalWasteValue);
      console.log('📅 Recent waste items:', recentWaste.length);

      // Calcular porcentaje de desperdicio
      let wastePercentage;
      
      if (totalStockValue === 0) {
        wastePercentage = 0; 
      } else {
        wastePercentage = (totalWasteValue / totalStockValue) * 100;
      }

      const finalWastePercentage = Math.min(100, Math.max(0, Math.round(wastePercentage * 100) / 100));
      
      console.log('🎯 Final waste percentage:', finalWastePercentage);
      return finalWastePercentage;

    } catch (error) {
      console.error('Error in waste percentage calculation:', error);
      return 0; 
    }
  };


  const handleRetry = () => {
    fetchWasteData();
  };

  if (isLoading) {
    return (
      <div className="waste-gauge-wrapper">
        <div className="waste-gauge-loading">
          <div className="waste-gauge-spinner"></div>
          <p>Calculando desperdicio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="waste-gauge-wrapper">
        <div className="waste-gauge-error">
          <p>⚠️ {error}</p>
          <button onClick={handleRetry} className="waste-gauge-retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <WasteGauge value={wastePercentage} title="Porcentaje de Desperdicio" />;
};

export default WasteGaugeWrapper;