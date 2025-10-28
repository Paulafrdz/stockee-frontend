import React, { useState, useEffect } from 'react';
import TopIngredientsChart from './TopIngredientsChart';
import { getStockItems } from '../../services/stockService';
import { getAllWaste } from '../../services/wasteService';
import './TopIngredientsChart.css';

const TopIngredientsChartWrapper = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data for top ingredients chart...');
      
      const [stockData, wasteData] = await Promise.all([
        getStockItems(),
        getAllWaste()
      ]);

      console.log('📦 Stock data:', stockData);
      console.log('🗑️ Waste data:', wasteData);

      const consumptionData = calculateConsumption(stockData, wasteData);
      
      console.log('📊 Consumption data:', consumptionData);
      setChartData(consumptionData);
      
    } catch (error) {
      console.error('❌ Error loading top ingredients data:', error);
      setError(error.response?.data?.message || 'Error al cargar los datos de consumo');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateConsumption = (stockItems, wasteItems) => {
    // Crear un mapa para agrupar waste por ingrediente
    const wasteByIngredient = {};
    
    wasteItems.forEach(waste => {
      const ingredientId = waste.ingredientId;
      if (!wasteByIngredient[ingredientId]) {
        wasteByIngredient[ingredientId] = 0;
      }
      wasteByIngredient[ingredientId] += waste.quantity;
    });

    // Combinar con datos de stock para obtener nombres
    const consumptionData = stockItems.map(item => {
      const consumed = wasteByIngredient[item.id] || 0;
      return {
        id: item.id,
        name: item.name,
        consumed: parseFloat(consumed.toFixed(2)), 
        unit: item.unit || 'kg',
        currentStock: item.currentStock || 0
      };
    });

    // Filtrar ingredientes con consumo > 0 y ordenar por consumo
    return consumptionData
      .filter(item => item.consumed > 0)
      .sort((a, b) => b.consumed - a.consumed);
  };

  const handleRetry = () => {
    fetchChartData();
  };

  if (isLoading) {
    return (
      <div className="top-ingredients-wrapper">
        <div className="top-ingredients-loading">
          <div className="top-ingredients-spinner"></div>
          <p>Cargando datos de consumo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-ingredients-wrapper">
        <div className="top-ingredients-error">
          <p>⚠️ {error}</p>
          <button onClick={handleRetry} className="top-ingredients-retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <TopIngredientsChart data={chartData} />;
};

export default TopIngredientsChartWrapper;