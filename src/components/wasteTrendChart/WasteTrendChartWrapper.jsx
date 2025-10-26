// WasteTrendChartWrapper.jsx
import React, { useState, useEffect } from 'react';
import { getAllWaste } from '../../services/wasteService';
import WasteTrendChart from './WasteTrendChart';

const WasteTrendChartWrapper = () => {
  const [wasteData, setWasteData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWasteData();
  }, []);

  const fetchWasteData = async () => {
    try {
      const data = await getAllWaste();
      setWasteData(data);
      processTrendData(data);
    } catch (error) {
      console.error('Error fetching waste data for trend chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processTrendData = (wasteItems) => {
    // Crear mapa para los últimos 6 meses
    const last6Months = getLast6Months();
    const monthlyData = {};
    
    // Inicializar todos los meses con 0
    last6Months.forEach(month => {
      monthlyData[month.key] = { month: month.label, value: 0 };
    });

    // Agrupar desperdicios por mes
    wasteItems.forEach(waste => {
      const wasteDate = new Date(waste.timestamp);
      const monthKey = `${wasteDate.getFullYear()}-${wasteDate.getMonth() + 1}`;
      const monthLabel = getMonthLabel(wasteDate);
      
      // Solo considerar los últimos 6 meses
      if (last6Months.find(m => m.key === monthKey)) {
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthLabel, value: 0 };
        }
        monthlyData[monthKey].value += waste.quantity;
      }
    });

    // Convertir a array y ordenar por fecha
    const trendData = Object.values(monthlyData)
      .sort((a, b) => {
        const monthOrder = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                           'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });

    setProcessedData(trendData);
  };

  const getLast6Months = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthLabel = getMonthLabel(date);
      months.push({ key: monthKey, label: monthLabel });
    }
    
    return months;
  };

  const getMonthLabel = (date) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                   'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[date.getMonth()];
  };

  if (isLoading) {
    return (
      <div className="waste-trend-container">
        <div className="waste-trend-loading">
          Cargando tendencias de desperdicio...
        </div>
      </div>
    );
  }

  return <WasteTrendChart data={processedData} />;
};

export default WasteTrendChartWrapper;