import React, { useState } from 'react';
import { Calendar, Package, X } from 'lucide-react';
import Button from '../button/Button';
import InputSelect from '../inputSelect/inputSelect';
import './OrderHistory.css';

const STATUS_CONFIG = {
  delivered:  { label: 'Entregado',  className: 'oh-badge--delivered' },
  pending:    { label: 'Pendiente',  className: 'oh-badge--pending' },
  cancelled:  { label: 'Cancelado',  className: 'oh-badge--cancelled' },
  processing: { label: 'Procesando', className: 'oh-badge--processing' },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] ?? { label: status, className: '' };
  return (
    <span className={`oh-badge ${config.className}`}>
      {config.label}
    </span>
  );
};

const OrderHistory = ({ orderHistory = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const filteredOrders = orderHistory.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;

    if (dateRange !== 'all') {
      const orderDate = new Date(order.date);
      const daysDiff = Math.floor((Date.now() - orderDate) / (1000 * 60 * 60 * 24));
      if (dateRange === 'week'    && daysDiff > 7)  return false;
      if (dateRange === 'month'   && daysDiff > 30) return false;
      if (dateRange === 'quarter' && daysDiff > 90) return false;
    }

    return true;
  });

  const closeModal = () => setSelectedOrder(null);

  return (
    <div className="oh-container">

      {/* Filtros */}
      <div className="oh-filters">
        <InputSelect
          label="Estado"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="delivered">Entregado</option>
          <option value="processing">Procesando</option>
          <option value="pending">Pendiente</option>
          <option value="cancelled">Cancelado</option>
        </InputSelect>

        <InputSelect
          label="Fechas"
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
        >
          <option value="all">Todas las fechas</option>
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
          <option value="quarter">Último trimestre</option>
        </InputSelect>
      </div>

      {/* Lista de pedidos */}
      <div className="oh-list">
        {filteredOrders.length === 0 ? (
          <div className="oh-empty">
            <Package className="oh-empty__icon" aria-hidden="true" />
            <h3>No se encontraron pedidos</h3>
            <p>Ningún pedido coincide con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="oh-card">
              <div className="oh-card__header">
                <div className="oh-card__info">
                  <span className="oh-card__id">Pedido #{order.id}</span>
                  <span className="oh-card__date">
                    <Calendar size={14} aria-hidden="true" />
                    {formatDate(order.date)}
                  </span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="oh-card__preview">
                {order.items?.slice(0, 3).map((item, index) => (
                  <span key={index} className="oh-item-chip">
                    {item.name} · {item.quantity} {item.unit}
                  </span>
                ))}
                {order.items?.length > 3 && (
                  <span className="oh-item-chip oh-item-chip--more">
                    +{order.items.length - 3} más
                  </span>
                )}
              </div>

              <div className="oh-card__actions">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setSelectedOrder(order)}
                >
                  Ver detalles
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <div
          className="oh-modal-wrapper"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalles del pedido #${selectedOrder.id}`}
        >
          {/* Overlay clickable para cerrar */}
          <div className="oh-modal-overlay" onClick={closeModal} />

          {/* Contenido — encima del overlay por z-index */}
          <div className="oh-modal">
            <div className="oh-modal__header">
              <h2 className="oh-modal__title">Pedido #{selectedOrder.id}</h2>
              <button
                className="oh-modal__close"
                onClick={closeModal}
                aria-label="Cerrar modal"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="oh-modal__body">

              {/* Info general */}
              <div className="oh-detail-section">
                <h3 className="oh-detail-section__title">Información del pedido</h3>
                <div className="oh-detail-grid">
                  <div className="oh-detail-item">
                    <span className="oh-detail-label">Fecha</span>
                    <span className="oh-detail-value">{formatDate(selectedOrder.date)}</span>
                  </div>
                  <div className="oh-detail-item">
                    <span className="oh-detail-label">Estado</span>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="oh-detail-item">
                    <span className="oh-detail-label">Total items</span>
                    <span className="oh-detail-value">{selectedOrder.itemCount}</span>
                  </div>
                  {selectedOrder.deliveryDate && (
                    <div className="oh-detail-item">
                      <span className="oh-detail-label">Entregado el</span>
                      <span className="oh-detail-value">{formatDate(selectedOrder.deliveryDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabla de items */}
              <div className="oh-detail-section">
                <h3 className="oh-detail-section__title">Items del pedido</h3>
                <table className="oh-items-table" aria-label="Items del pedido">
                  <thead>
                    <tr>
                      <th scope="col">Ingrediente</th>
                      <th scope="col">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity} {item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            <div className="oh-modal__footer">
              <Button variant="secondary" onClick={closeModal}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;