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
    const causaLower = causa.toLowerCase();
    if (causaLower.includes('caducidad')) return 'product-eff-badge-caducidad';
    if (causaLower.includes('error')) return 'product-eff-badge-error';
    if (causaLower === 'ninguna') return 'product-eff-badge-ninguna';
    return 'product-eff-badge-default';
  };

  const formatCurrency = (amount) => {
    return `€${amount}`;
  };

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
              <th 
                className="product-eff-th product-eff-th-clickable product-eff-th-right"
                onClick={() => handleSort('loss')}
              >
                Pérdida €
                {sortConfig.key === 'loss' && (
                  <span className="product-eff-sort-icon">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
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
                          backgroundColor: product.efficiency >= 90 ? '#4ade80' : 
                                          product.efficiency >= 80 ? '#fb923c' : 
                                          '#ec4899'
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
                    {product.mainCause}
                  </span>
                </td>
                <td className="product-eff-td product-eff-td-right">
                  <span className="product-eff-loss">{formatCurrency(product.loss)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductEfficiencyTable;