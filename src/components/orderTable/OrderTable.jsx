import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, ShoppingCart, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import Button from '../button/Button';
import './OrderTable.css';

const OrderTable = ({
  recommendedOrders = [],
  onQuantityChange,
  onGlobalAdjustment,
  onDeleteItem,
  isSubmitting = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Get stock status (similar to StockTable)
  const getStockStatus = (currentStock, minimumStock) => {
    if (typeof currentStock !== 'number' || typeof minimumStock !== 'number') {
      return 'ok';
    }

    if (minimumStock <= 0) {
      return currentStock <= 0 ? 'empty' : 'ok';
    }

    if (currentStock <= 0) return 'empty';
    if (currentStock <= minimumStock * 0.5) return 'critical';
    if (currentStock <= minimumStock) return 'low';
    return 'ok';
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'critical': return 'Crítico';
      case 'low': return 'Low';
      case 'empty': return 'Empty';
      case 'ok': return 'Ok';
      default: return 'Ok';
    }
  };

  // Process items with status
  const processedItems = useMemo(() => {
    return recommendedOrders.map(item => ({
      ...item,
      status: getStockStatus(item.currentStock, item.minimumStock),
      statusLabel: getStatusLabel(getStockStatus(item.currentStock, item.minimumStock))
    }));
  }, [recommendedOrders]);

  // Filter ingredients based on search and filters
  const filteredOrders = useMemo(() => {
    let filtered = processedItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showOnlyRecommended) {
      filtered = filtered.filter(item => item.currentStock < item.minimumStock);
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by name
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.name.localeCompare(b.name);
    });
  }, [processedItems, searchTerm, showOnlyRecommended]);

  // Calculate order totals
  const orderTotals = useMemo(() => {
    const itemsToOrder = filteredOrders.filter(item => item.recommendedQuantity > 0);
    
    return {
      itemCount: itemsToOrder.length,
      urgentItems: itemsToOrder.filter(item => item.priority === 'high').length
    };
  }, [filteredOrders]);

  // Get priority color classes
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  // Get stock status icon
  const getStockStatusIcon = (currentStock, minimumStock) => {
    if (currentStock < minimumStock * 0.5) {
      return <AlertTriangle className="stock-icon stock-icon--critical" />;
    } else if (currentStock < minimumStock) {
      return <TrendingUp className="stock-icon stock-icon--low" />;
    }
    return <div className="stock-icon stock-icon--ok"></div>;
  };

  return (
    <div className="recommended-orders-table">
        {/* Header Controls */}
      <div className="table-header">
        <div className="table-header__controls">
          {/* Search Bar */}
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Global Adjustment Buttons */}
          <div className="global-controls">
            <Button
              variant="secondary"
              size="small"
              icon={Minus}
              onClick={() => onGlobalAdjustment(0.8)}
              disabled={isSubmitting}
              className="global-btn global-btn--decrease"
            >
              Less
            </Button>
            <Button
              variant="secondary"
              size="small"
              icon={Plus}
              onClick={() => onGlobalAdjustment(1.2)}
              disabled={isSubmitting}
              className="global-btn global-btn--increase"
            >
              More
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="table-filters">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyRecommended}
              onChange={(e) => setShowOnlyRecommended(e.target.checked)}
            />
            <span>Muestra solo ingredientes con bajo stock</span>
          </label>
        </div>
      </div>

      <div className="table-container">
        {/* Table Header */}
        <div className="order-th">
          <div>Ingredientes</div>
          <div>Actual</div>
          <div>Minimo</div>
          <div>Uso semana</div>
          <div>Cantidad Recomendada</div>
          <div></div>
        </div>

        {/* Table Body */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item) => (
            <div key={item.id} className={`order-table-row status-row-${item.status}`}>
              {/* Ingredient */}
              <div className="ingredient-cell">
                <div className="ingredient-info">
                  {getStockStatusIcon(item.currentStock, item.minimumStock)}
                  <div className="ingredient-details">
                    <div className="ingredient-name">{item.name}</div>
                    <div className={`priority-badge priority-${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Stock */}
              <div className="stock-cell">
                <div className="stock-value">
                  <span className={`stock-badge stock-${item.status}`}>
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                {item.lastOrderDate && (
                  <div className="last-order">
                    Updated: {new Date(item.lastOrderDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Minimum */}
              <div className="minimum-cell">
                {item.minimumStock} {item.unit}
              </div>

              {/* Weekly Usage */}
              <div className="usage-cell">
                {item.weeklyUsage} {item.unit}
              </div>

              {/* Recommended Quantity */}
              <div className="quantity-cell">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn quantity-btn--decrease"
                    onClick={() => onQuantityChange(item.id, item.recommendedQuantity - 1)}
                    disabled={isSubmitting}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={item.recommendedQuantity}
                    onChange={(e) => onQuantityChange(item.id, parseFloat(e.target.value) || 0)}
                    className="quantity-input"
                    min="0"
                    step="0.1"
                    disabled={isSubmitting}
                  />
                  <span className="quantity-unit">{item.unit}</span>
                  <button
                    className="quantity-btn quantity-btn--increase"
                    onClick={() => onQuantityChange(item.id, item.recommendedQuantity + 1)}
                    disabled={isSubmitting}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="actions-cell">
                <button
                  className="remove-btn"
                   onClick={() => onDeleteItem(item.id)}
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-message">
              {searchTerm ? "No ingredients match your search" : "No ingredients found"}
            </div>
            <div className="empty-description">
              {searchTerm ? "Try different search terms" : "Add your first ingredient"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;