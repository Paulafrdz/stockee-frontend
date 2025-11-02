import React, { useState, useEffect } from 'react';
import './ProductEfficiencyTable.css';

const ProductEfficiencyTable = ({ products = [] }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...products];
    
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableProducts;
  }, [products, sortConfig]);

  const getCausaBadgeClass = (causa) => {
    const causaLower = causa?.toLowerCase() || '';
    
    const badgeMap = {
      'expired': 'product-eff-badge-caducidad',
      'burned': 'product-eff-badge-error',
      'wrong-ingredient': 'product-eff-badge-error',
      'over-preparation': 'product-eff-badge-error',
      'natural-waste': 'product-eff-badge-other',
      'breakage': 'product-eff-badge-other',
      'other': 'product-eff-badge-other',
      'none': 'product-eff-badge-ninguna'
    };
    
    return badgeMap[causaLower] || 'product-eff-badge-ninguna';
  };

  const getMainCauseLabel = (mainCause) => {
    const labelMap = {
      'expired': 'Caducidad',
      'burned': 'Error - Quemado',
      'wrong-ingredient': 'Error - Ingrediente incorrecto',
      'breakage': 'Rotura/Caída',
      'natural-waste': 'Merma Natural',
      'over-preparation': 'Preparación Excesiva',
      'other': 'Otro',
      'none': 'Ninguna'
    };
    return labelMap[mainCause] || mainCause;
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return '#4ade80';
    if (efficiency >= 80) return '#fb923c';
    return '#ec4899';
  };

  // ========================================
  // NUEVA FUNCIÓN: Renderizar Mobile Cards
  // ========================================
  const renderMobileCards = () => {
    if (sortedProducts.length === 0) return null;
    
    return (
      <div className="product-eff-mobile-cards">
        {sortedProducts.map((product) => {
          const efficiencyColor = getEfficiencyColor(product.efficiency);
          
          return (
            <div key={product.id} className="product-eff-mobile-card">
              
              {/* Header: Nombre del producto */}
              <div className="product-eff-mobile-card-header">
                <div className="product-eff-mobile-product-name">
                  {product.name}
                </div>
              </div>
              
              {/* Eficiencia con barra */}
              <div className="product-eff-mobile-efficiency">
                <div className="product-eff-mobile-row">
                  <span className="product-eff-mobile-label">Eficiencia</span>
                  <span className="product-eff-mobile-value">{product.efficiency}%</span>
                </div>
                <div className="product-eff-mobile-progress">
                  <div 
                    className="product-eff-mobile-progress-fill"
                    style={{
                      width: `${product.efficiency}%`,
                      backgroundColor: efficiencyColor
                    }}
                  />
                </div>
              </div>
              
              {/* Desperdicio */}
              <div className="product-eff-mobile-row">
                <span className="product-eff-mobile-label">Desperdicios</span>
                <span className="product-eff-mobile-value">{product.wastePercentage}%</span>
              </div>
              
              {/* Causa Principal */}
              <div className="product-eff-mobile-row">
                <span className="product-eff-mobile-label">Causa Principal</span>
                <span className={`product-eff-badge ${getCausaBadgeClass(product.mainCause)}`}>
                  {getMainCauseLabel(product.mainCause)}
                </span>
              </div>
              
            </div>
          );
        })}
      </div>
    );
  };

  // Empty state
  if (products.length === 0) {
    return (
      <div className="product-eff-container">
        <div className="product-eff-header">
          <h3 className="product-eff-title">Eficiencia por Producto</h3>
          <p className="product-eff-subtitle">Rendimiento Individual</p>
        </div>
        <div className="product-eff-empty">
          <p>No hay datos de productos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-eff-container">
      <div className="product-eff-header">
        <h3 className="product-eff-title">Eficiencia por Producto</h3>
        <p className="product-eff-subtitle">Rendimiento Individual</p>
      </div>

      {/* ===== TABLA - Visible en Desktop, Oculta en Mobile ===== */}
      <div className="product-eff-table-wrapper">
        <table className="product-eff-table">
          <thead className="product-eff-thead">
            <tr className="product-eff-thead-row">
              <th 
                className="product-eff-th product-eff-th-clickable"
                onClick={() => handleSort('name')}
              >
                Producto
                {sortConfig.key === 'name' && (
                  <span className="product-eff-sort-icon">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="product-eff-th product-eff-th-clickable"
                onClick={() => handleSort('efficiency')}
              >
                Eficiencia
                {sortConfig.key === 'efficiency' && (
                  <span className="product-eff-sort-icon">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="product-eff-th product-eff-th-clickable"
                onClick={() => handleSort('wastePercentage')}
              >
                Desperdicios
                {sortConfig.key === 'wastePercentage' && (
                  <span className="product-eff-sort-icon">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="product-eff-th">Causa Principal</th>
            </tr>
          </thead>
          <tbody className="product-eff-tbody">
            {sortedProducts.map((product) => (
              <tr key={product.id} className="product-eff-row">
                <td className="product-eff-td product-eff-product-name">
                  {product.name}
                </td>
                <td className="product-eff-td">
                  <div className="product-eff-efficiency-cell">
                    <div className="product-eff-progress-bar">
                      <div 
                        className="product-eff-progress-fill"
                        style={{ 
                          width: `${product.efficiency}%`,
                          backgroundColor: getEfficiencyColor(product.efficiency)
                        }}
                      />
                    </div>
                    <div className="product-eff-efficiency-text">
                      <span className="product-eff-percentage-main">{product.efficiency}%</span>
                      <span className="product-eff-percentage-secondary">{product.wastePercentage}%</span>
                    </div>
                  </div>
                </td>
                <td className="product-eff-td product-eff-waste-cell">
                  <span className="product-eff-waste-percentage">
                    {product.wastePercentage}%
                  </span>
                </td>
                <td className="product-eff-td">
                  <span className={`product-eff-badge ${getCausaBadgeClass(product.mainCause)}`}>
                    {getMainCauseLabel(product.mainCause)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== CARDS - Visible en Mobile, Ocultas en Desktop ===== */}
      {renderMobileCards()}
      
    </div>
  );
};

export default ProductEfficiencyTable;