// ProductEfficiencyWrapper.jsx
import React, { useState, useEffect } from 'react';
import { getAllWaste } from '../../services/wasteService';
import ProductEfficiencyTable from './ProductEfficiencyTable';

const ProductEfficiencyWrapper = () => {
  const [wasteData, setWasteData] = useState([]);
  const [processedProducts, setProcessedProducts] = useState([]);
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
      console.error('Error fetching waste data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processWasteData = (wasteItems) => {
    // Agrupar desperdicios por ingrediente
    const productsMap = {};
    
    wasteItems.forEach(waste => {
      if (!productsMap[waste.ingredientId]) {
        productsMap[waste.ingredientId] = {
          id: waste.ingredientId,
          name: waste.ingredientName,
          totalWaste: 0,
          wasteByReason: {},
          totalUsage: 100 // Esto deberías obtenerlo de otro servicio
        };
      }
      
      // Sumar cantidad desperdiciada
      productsMap[waste.ingredientId].totalWaste += waste.quantity;
      
      // Contar por razón
      if (!productsMap[waste.ingredientId].wasteByReason[waste.reason]) {
        productsMap[waste.ingredientId].wasteByReason[waste.reason] = 0;
      }
      productsMap[waste.ingredientId].wasteByReason[waste.reason]++;
    });

    // Convertir a formato que necesita la tabla
    const processed = Object.values(productsMap).map(product => {
      const wastePercentage = Math.min((product.totalWaste / product.totalUsage) * 100, 100);
      const efficiency = 100 - wastePercentage;
      
      // Encontrar causa principal
      const mainCause = Object.entries(product.wasteByReason)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Ninguna';
      
      // Calcular pérdida (necesitarías precios de los ingredientes)
      const averagePrice = 5; // Esto debería venir de tu base de datos
      const loss = product.totalWaste * averagePrice;

      return {
        id: product.id,
        name: product.name,
        efficiency: Math.round(efficiency),
        wastePercentage: Math.round(wastePercentage),
        mainCause: getCausaLabel(mainCause),
        loss: Math.round(loss * 100) / 100
      };
    });

    setProcessedProducts(processed);
  };

  const getCausaLabel = (reason) => {
    const labelMap = {
      'caducidad': 'Caducidad',
      'quemado': 'Error - Quemado',
      'ingrediente-incorrecto': 'Error - Ingrediente Incorrecto',
      'rotura': 'Rotura/Caída',
      'merma': 'Merma Natural',
      'preparacion-excesiva': 'Preparación Excesiva',
      'otro': 'Otra Causa'
    };
    return labelMap[reason] || reason;
  };

  if (isLoading) {
    return <div>Cargando datos de eficiencia...</div>;
  }

  return <ProductEfficiencyTable products={processedProducts} />;
};

export default ProductEfficiencyWrapper;