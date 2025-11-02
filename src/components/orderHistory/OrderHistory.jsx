import React, { useState } from 'react';
import { Calendar, Package, Download, Eye } from 'lucide-react';
import Button from '../button/Button';
import './OrderHistory.css';

const OrderHistory = ({ orderHistory = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Filter orders based on status and date
  const filteredOrders = orderHistory.filter(order => {
    // Status filter
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }

    // Date filter
    if (dateRange !== 'all') {
      const orderDate = new Date(order.date);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

      switch (dateRange) {
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        case 'quarter':
          return daysDiff <= 90;
        default:
          return true;
      }
    }

    return true;
  });

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'status-badge status-badge--delivered';
      case 'pending':
        return 'status-badge status-badge--pending';
      case 'cancelled':
        return 'status-badge status-badge--cancelled';
      case 'processing':
        return 'status-badge status-badge--processing';
      default:
        return 'status-badge status-badge--unknown';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle order details view
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  // Handle download receipt (placeholder)
  const handleDownloadReceipt = (order) => {
    console.log('Downloading receipt for order:', order.id);
    // Implement PDF generation or API call here
  };

  return (
    <div className="order-history">
      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Estado:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="delivered">Enviado</option>
            <option value="processing">Procesando</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="date-filter">Fechas</label>
          <select
            id="date-filter"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las fechas</option>
            <option value="week">Última semana</option>
            <option value="month">Última mes</option>
            <option value="quarter">Último trimestre</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-history">
            <Package className="empty-icon" />
            <h3>No orders found</h3>
            <p>No orders match your current filters.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card__header">
                <div className="order-info">
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-date">
                    <Calendar size={14} />
                    {formatDate(order.date)}
                  </div>
                </div>
                <div className="order-status">
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-card__content">
                <div className="order-summary">
                  <div className="summary-item">
                    <span className="summary-label">Items:</span>
                    <span className="summary-value">{order.itemCount}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Status:</span>
                    <span className="summary-value">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <span key={index} className="item-preview">
                      {item.name} ({item.quantity} {item.unit})
                    </span>
                  ))}
                  {order.items?.length > 3 && (
                    <span className="item-preview item-preview--more">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="order-card__actions">
                <Button
                  variant="secondary"
                  size="small"
                  icon={Eye}
                  onClick={() => handleViewDetails(order)}
                >
                  View Details
                </Button>
                {order.status === 'delivered' && (
                  <Button
                    variant="secondary"
                    size="small"
                    icon={Download}
                    onClick={() => handleDownloadReceipt(order)}
                  >
                    Receipt
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)} />
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order #{selectedOrder.id}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="order-details">
                <div className="detail-section">
                  <h3>Order Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={getStatusBadge(selectedOrder.status)}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Items:</span>
                      <span className="detail-value">{selectedOrder.itemCount}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Ordered Items</h3>
                  <div className="items-table">
                    <div className="items-header">
                      <span>Item</span>
                      <span>Quantity</span>
                    </div>
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="items-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">{item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.deliveryDate && (
                  <div className="detail-section">
                    <h3>Delivery Information</h3>
                    <div className="detail-item">
                      <span className="detail-label">Delivered on:</span>
                      <span className="detail-value">{formatDate(selectedOrder.deliveryDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;