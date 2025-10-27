import React, { useState, useEffect } from 'react';
import { getAllWaste } from '../../services/wasteService';
import { getStockItems } from '../../services/stockService';
import ProductEfficiencyTable from '../productEfficiencyTable/ProductEfficiencyTable';

const ProductEfficiencyWrapper = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [wasteData, stockData] = await Promise.all([
        getAllWaste(),
        getStockItems()
      ]);

      console.log('📊 Processing efficiency data:', {
        wasteItems: wasteData.length,
        stockItems: stockData.length
      });

      const processedProducts = processEfficiencyData(wasteData, stockData);
      setProducts(processedProducts);
      
    } catch (error) {
      console.error('❌ Error fetching efficiency data:', error);
      setError('Error al cargar datos de eficiencia');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const processEfficiencyData = (wasteItems, stockItems) => {
    // Crear mapa de productos con sus desperdicios
    const productsMap = {};
    
    // 1. Agrupar desperdicios por ingrediente
    wasteItems.forEach(waste => {
      const ingredientId = waste.ingredientId;
      
      if (!productsMap[ingredientId]) {
        productsMap[ingredientId] = {
          id: ingredientId,
          name: waste.ingredientName,
          totalWaste: 0,
          wasteByReason: {},
          totalUsage: 0
        };
      }
      
      productsMap[ingredientId].totalWaste += waste.quantity;
      
      if (!productsMap[ingredientId].wasteByReason[waste.reason]) {
        productsMap[ingredientId].wasteByReason[waste.reason] = 0;
      }
      productsMap[ingredientId].wasteByReason[waste.reason]++;
    });

    // 2. Combinar con datos de stock
    stockItems.forEach(stockItem => {
      if (productsMap[stockItem.id]) {
        productsMap[stockItem.id].totalUsage = stockItem.currentStock + productsMap[stockItem.id].totalWaste;
      }
    });

    // 3. Convertir al formato de la tabla
    const processedProducts = Object.values(productsMap)
      .filter(product => product.totalUsage > 0)
      .map(product => {
        const wastePercentage = (product.totalWaste / product.totalUsage) * 100;
        const efficiency = Math.max(0, 100 - wastePercentage);
        
        const mainCauseEntry = Object.entries(product.wasteByReason)
          .sort(([,a], [,b]) => b - a)[0];
        
        const mainCause = mainCauseEntry ? mainCauseEntry[0] : 'ninguna';
        const loss = product.totalWaste * 2.5; // Precio promedio estimado

        return {
          id: product.id,
          name: product.name,
          efficiency: Math.round(efficiency),
          wastePercentage: Math.round(wastePercentage),
          mainCause: getCausaLabel(mainCause),
          loss: Math.round(loss * 100) / 100
        };
      });

    return processedProducts;
  };

  const getCausaLabel = (reason) => {
    const labelMap = {
      'caducidad': 'Caducidad',
      'quemado': 'Error - Quemado',
      'ingrediente-incorrecto': 'Error - Ingrediente Incorrecto',
      'rotura': 'Rotura/Caída',
      'merma': 'Merma Natural',
      'preparacion-excesiva': 'Preparación Excesiva',
      'ninguna': 'Ninguna',
      'otro': 'Otra Causa'
    };
    return labelMap[reason] || reason;
  };

  if (isLoading) {
    return (
      <div className="table-loading">
        <div className="loading-spinner"></div>
        <p>Cargando análisis de eficiencia...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-error">
        <p>⚠️ {error}</p>
        <button onClick={fetchData} className="retry-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return <ProductEfficiencyTable products={products} />;
};

export default ProductEfficiencyWrapper;