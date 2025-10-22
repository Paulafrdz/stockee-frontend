import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, ShoppingCart, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import Button from '../button/Button';
import './OrderTable.css';

const OrderTable = ({
  recommendedOrders = [],
  onQuantityChange,
  onGlobalAdjustment,
  onSubmitOrder,
  onClearAll,
  isSubmitting = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Filter ingredients based on search and filters
  const filteredOrders = useMemo(() => {
    let filtered = recommendedOrders.filter(item =>
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
  }, [recommendedOrders, searchTerm, showOnlyRecommended]);

  // Calculate order totals
  const orderTotals = useMemo(() => {
    const itemsToOrder = filteredOrders.filter(item => item.recommendedQuantity > 0);
    
    return {
      itemCount: itemsToOrder.length,
      urgentItems: itemsToOrder.filter(item => item.priority === 'high').length
    };
  }, [filteredOrders]);

  // Handle order submission with success state
  const handleSubmitOrder = async () => {
    const itemsToOrder = recommendedOrders
      .filter(item => item.recommendedQuantity > 0)
      .map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.recommendedQuantity,
        unit: item.unit,
        priority: item.priority
      }));

    if (itemsToOrder.length === 0) return;

    try {
      await onSubmitOrder({
        items: itemsToOrder,
        timestamp: new Date().toISOString()
      });
      
      setOrderSubmitted(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setOrderSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

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
            <span>Show only low stock ingredients</span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Current Stock</th>
              <th>Minimum</th>
              <th>Weekly Usage</th>
              <th>Recommended Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((item) => (
              <tr key={item.id} className="table-row">
                <td className="ingredient-cell">
                  <div className="ingredient-info">
                    {getStockStatusIcon(item.currentStock, item.minimumStock)}
                    <div className="ingredient-details">
                      <div className="ingredient-name">{item.name}</div>
                      <div className={`priority-badge ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="stock-cell">
                  <div className="stock-value">
                    {item.currentStock} {item.unit}
                  </div>
                  {item.lastOrderDate && (
                    <div className="last-order">
                      Updated: {new Date(item.lastOrderDate).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="minimum-cell">
                  {item.minimumStock} {item.unit}
                </td>
                <td className="usage-cell">
                  {item.weeklyUsage} {item.unit}
                </td>
                <td className="quantity-cell">
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
                </td>
                <td className="actions-cell">
                  <button
                    className="remove-btn"
                    onClick={() => onQuantityChange(item.id, 0)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <div className="empty-message">No ingredients found</div>
            <div className="empty-description">
              {searchTerm ? 'Try different search terms' : 'No ingredients to display'}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      {orderTotals.itemCount > 0 && (
        <div className="order-summary">
          <div className="summary-content">
            <div className="summary-header">
              <div className="summary-title">
                <h3>Order Summary</h3>
                <p>{orderTotals.itemCount} ingredient{orderTotals.itemCount !== 1 ? 's' : ''} to order</p>
              </div>
            </div>
            
            {/* Order Details */}
            <div className="summary-details">
              <div className="detail-row">
                <span>Items to order:</span>
                <span>{orderTotals.itemCount}</span>
              </div>
              <div className="detail-row">
                <span>Urgent items:</span>
                <span className="urgent-count">{orderTotals.urgentItems}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="summary-actions">
              <Button
                variant="secondary"
                size="medium"
                onClick={onClearAll}
                disabled={isSubmitting}
              >
                Clear All
              </Button>
              
              <Button
                variant={orderSubmitted ? 'success' : 'primary'}
                size="medium"
                icon={isSubmitting ? null : orderSubmitted ? CheckCircle : ShoppingCart}
                onClick={handleSubmitOrder}
                disabled={isSubmitting || orderTotals.itemCount === 0}
                className="submit-order-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="orders-loading-spinner"></div>
                    Processing...
                  </>
                ) : orderSubmitted ? (
                  'Order Submitted!'
                ) : (
                  'Submit Order'
                )}
              </Button>
            </div>

            {/* Success Message */}
            {orderSubmitted && (
              <div className="success-message">
                <CheckCircle className="success-icon" />
                <div className="success-content">
                  <div className="success-title">Order processed successfully!</div>
                  <div className="success-description">
                    Stock has been updated and quantities have been reset.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;