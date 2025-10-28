import React, { useState, useEffect } from 'react';
import ConsumptionTrendChart from './ConsumptionTrendChart';
import { getAllWaste } from '../../services/wasteService';
import './ConsumptionTrendChart.css';

const ConsumptionTrendChartWrapper = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  const fetchConsumptionData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data for ingredients consumption...');
      
      const wasteData = await getAllWaste();
      console.log('🗑️ Waste data for consumption:', wasteData);

      const processedData = processIngredientsConsumption(wasteData);
      
      console.log('📊 Processed consumption data:', processedData);
      setChartData(processedData);
      
    } catch (error) {
      console.error('❌ Error loading ingredients consumption data:', error);
      setError(error.response?.data?.message || 'Error al cargar los datos de consumo');
    } finally {
      setIsLoading(false);
    }
  };

  const processIngredientsConsumption = (wasteData) => {
    if (!wasteData.length) {
      return [];
    }

    try {
      // Agrupar por mes
      const monthlyData = {};
      
      wasteData.forEach(waste => {
        const date = new Date(waste.timestamp);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = getMonthName(date);
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            totalConsumption: 0,
            ingredients: {}
          };
        }
        
        // Sumar al consumo total
        monthlyData[monthKey].totalConsumption += waste.quantity || 0;
        
        // Agrupar por ingrediente
        const ingredientName = waste.ingredientName || 'Ingrediente desconocido';
        if (!monthlyData[monthKey].ingredients[ingredientName]) {
          monthlyData[monthKey].ingredients[ingredientName] = 0;
        }
        monthlyData[monthKey].ingredients[ingredientName] += waste.quantity || 0;
      });

      // Procesar para el formato final
      const result = Object.values(monthlyData)
        .sort((a, b) => {
          const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          return months.indexOf(a.month) - months.indexOf(b.month);
        })
        .map(monthData => ({
          month: monthData.month,
          totalConsumption: Math.round(monthData.totalConsumption * 100) / 100,
          topIngredients: Object.entries(monthData.ingredients)
            .map(([name, consumed]) => ({ name, consumed: Math.round(consumed * 100) / 100 }))
            .sort((a, b) => b.consumed - a.consumed)
            .slice(0, 3) // Top 3 ingredientes del mes
        }));

      return result.slice(-6); // Últimos 6 meses

    } catch (error) {
      console.error('Error processing consumption data:', error);
      return [];
    }
  };

  const getMonthName = (date) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[date.getMonth()];
  };

  const handleRetry = () => {
    fetchConsumptionData();
  };

  if (isLoading) {
    return (
      <div className="ingredients-consumption-wrapper">
        <div className="ingredients-consumption-loading">
          <div className="ingredients-consumption-spinner"></div>
          <p>Analizando consumo de ingredientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ingredients-consumption-wrapper">
        <div className="ingredients-consumption-error">
          <p>⚠️ {error}</p>
          <button onClick={handleRetry} className="ingredients-consumption-retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <ConsumptionTrendChart data={chartData} />;
};

export default ConsumptionTrendChartWrapper;