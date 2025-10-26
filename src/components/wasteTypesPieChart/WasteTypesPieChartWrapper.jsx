// WasteTypesPieChartWrapper.jsx
import React, { useState, useEffect } from 'react';
import { getAllWaste } from '../../services/wasteService';
import WasteTypesPieChart from './WasteTypesPieChart';

const WasteTypesPieChartWrapper = () => {
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
      processWasteData(data);
    } catch (error) {
      console.error('Error fetching waste data for pie chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processWasteData = (wasteItems) => {
    // Agrupar por categorías de desperdicio
    const categories = {
      'Caducidad': 0,
      'Errores Elaboración': 0, 
      'Otros (Merma, Roturas)': 0
    };

    wasteItems.forEach(waste => {
      // Mapear razones específicas a categorías generales
      switch (waste.reason) {
        case 'caducidad':
          categories['Caducidad'] += waste.quantity;
          break;
        
        case 'quemado':
        case 'ingrediente-incorrecto':
        case 'preparacion-excesiva':
          categories['Errores Elaboración'] += waste.quantity;
          break;
        
        case 'merma':
        case 'rotura':
        default:
          categories['Otros (Merma, Roturas)'] += waste.quantity;
          break;
      }
    });

    // Convertir a formato que espera el gráfico
    const pieData = Object.entries(categories)
      .filter(([_, amount]) => amount > 0) // Solo categorías con datos
      .map(([type, amount]) => ({
        type,
        amount: Math.round(amount * 100) / 100 // Redondear a 2 decimales
      }));

    setProcessedData(pieData);
  };

  if (isLoading) {
    return (
      <div className="waste-pie-container">
        <div className="waste-pie-loading">
          Cargando datos de desperdicios...
        </div>
      </div>
    );
  }

  return <WasteTypesPieChart data={processedData} />;
};

export default WasteTypesPieChartWrapper;