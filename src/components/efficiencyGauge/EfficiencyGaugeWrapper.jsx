import React, { useState, useEffect } from 'react';
import EfficiencyGauge from './EfficiencyGaudge';
import { getStockItems } from '../../services/stockService';
import { getAllWaste } from '../../services/wasteService';
import './EfficiencyGauge.css';

const EfficiencyGaugeWrapper = () => {
  const [efficiency, setEfficiency] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEfficiencyData();
  }, []);

  const fetchEfficiencyData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data for efficiency calculation...');
      
      // Obtener datos de stock y waste
      const [stockData, wasteData] = await Promise.all([
        getStockItems(),
        getAllWaste()
      ]);

      console.log('📦 Stock data:', stockData);
      console.log('🗑️ Waste data:', wasteData);

      // Calcular eficiencia basada en el ratio de desperdicio
      const calculatedEfficiency = calculateEfficiency(stockData, wasteData);
      
      console.log('📊 Calculated efficiency:', calculatedEfficiency);
      setEfficiency(calculatedEfficiency);
      
    } catch (error) {
      console.error('❌ Error loading efficiency data:', error);
      setError(error.response?.data?.message || 'Error al calcular la eficiencia');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para calcular la eficiencia
  const calculateEfficiency = (stockItems, wasteItems) => {
    if (!stockItems.length || !wasteItems.length) {
      return 0; 
    }

    try {
      const totalStockValue = stockItems.reduce((total, item) => {
        return total + (item.currentStock || 0);
      }, 0);

      const totalWasteValue = wasteItems.reduce((total, waste) => {
        return total + (waste.quantity || 0);
      }, 0);

      console.log('💰 Total stock value:', totalStockValue);
      console.log('🗑️ Total waste value:', totalWasteValue);

      // Calcular eficiencia: 100% - porcentaje de desperdicio
      let efficiencyPercentage;
      
      if (totalStockValue === 0) {
        efficiencyPercentage = 100; // Si no hay stock, eficiencia máxima
      } else {
        const wastePercentage = (totalWasteValue / totalStockValue) * 100;
        efficiencyPercentage = Math.max(0, 100 - wastePercentage);
      }

      const finalEfficiency = Math.min(100, Math.max(0, Math.round(efficiencyPercentage * 100) / 100));
      
      console.log('🎯 Final efficiency:', finalEfficiency);
      return finalEfficiency;

    } catch (error) {
      console.error('Error in efficiency calculation:', error);
      return 0; 
    }
  };


  const handleRetry = () => {
    fetchEfficiencyData();
  };

  if (isLoading) {
    return (
      <div className="efficiency-gauge-wrapper">
        <div className="efficiency-gauge-loading">
          <div className="efficiency-gauge-spinner"></div>
          <p>Calculando eficiencia...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="efficiency-gauge-wrapper">
        <div className="efficiency-gauge-error">
          <p>⚠️ {error}</p>
          <button onClick={handleRetry} className="efficiency-gauge-retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <EfficiencyGauge value={efficiency} title="Eficiencia General" />;
};

export default EfficiencyGaugeWrapper;