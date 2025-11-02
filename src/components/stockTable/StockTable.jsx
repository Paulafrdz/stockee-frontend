import React from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import StockFilters from '../stockFilters/StockFilters';
import './StockTable.css';

const StockTable = ({ 
  stockItems = [], 
  onUpdateStock, 
  onEditIngredient,
  onDeleteIngredient,
  searchTerm = '',
  onSearchChange,
  filterStatus = 'all',
  onFilterChange 
}) => {

  const getStockStatus = (currentStock, minimumStock) => {
    if (currentStock <= minimumStock * 0.5) return 'critical';
    if (currentStock <= minimumStock) return 'low';
    return 'ok';
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'critical': return 'Crítico';
      case 'low': return 'Low';
      case 'ok': return 'Ok';
      default: return 'Ok';
    }
  };

  const processedItems = stockItems.map(item => ({
    ...item,
    status: getStockStatus(item.currentStock, item.minimumStock),
    statusLabel: getStatusLabel(getStockStatus(item.currentStock, item.minimumStock))
  }));

  const filteredItems = processedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    critical: processedItems.filter(item => item.status === 'critical').length,
    low: processedItems.filter(item => item.status === 'low').length,
    ok: processedItems.filter(item => item.status === 'ok').length,
    total: processedItems.length
  };

  const handleStockUpdate = (item, newActual) => {
    if (onUpdateStock) {
      onUpdateStock(item.id, parseFloat(newActual));
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (timestamp === 'ahora') return 'ahora';
    return timestamp;
  };

  return (
    <div className="stock-table-container">
      {/* Alert Banner */}
      {(statusCounts.critical > 0 || statusCounts.low > 0) && (
        <div className="stock-alert-banner">
          <AlertTriangle className="alert-icon" size={20} />
          <div className="alert-content">
            <div className="alert-title">
              {statusCounts.critical + statusCounts.low} items necesitan atención
            </div>
            <div className="alert-text">
              {statusCounts.critical > 0 && `${statusCounts.critical} críticos, `}
              {statusCounts.low > 0 && `${statusCounts.low} stock bajo`}
            </div>
          </div>
        </div>
      )}

    
      {/* Filtros reutilizables */}
      <StockFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filterStatus={filterStatus}
        onFilterChange={onFilterChange}
        statusCounts={statusCounts}
        totalLabel="Total"
        filterLabels={{
          critical: 'Crítico',
          low: 'Low',
          ok: 'Ok'
        }}
        searchPlaceholder="Buscar ingredientes..."
      />

      {/* Table */}
      <div className="stock-table">

        <div className="table-content">
          <div className="table-head">
            <div className="th">Ingredientes</div>
            <div className="th">Actual</div>
            <div className="th">Mínimo</div>
            <div className="th">Unidad</div>
            <div className="th">Estado</div>
            <div className="th">Última actualización</div>
            <div className="th"></div>
          </div>

          <div className="table-body">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className={`table-row status-row-${item.status}`}>
                  <div className="td stock-ingredient-name">
                    {item.name}
                  </div>
                  
                  <div className="td stock-currentStock">
                    <span className={`stock-value stock-${item.status}`}>
                      {item.currentStock}
                    </span>
                  </div>
                  
                  <div className="td stock-minimum">
                    {item.minimumStock}
                  </div>
                  
                  <div className="td stock-unit">
                    {item.unit}
                  </div>
                  
                  <div className="td stock-status">
                    <span className={`status-badge status-${item.status}`}>
                      {item.statusLabel}
                    </span>
                  </div>
                  
                  <div className="td last-updated text-muted">
                    {formatTimeAgo(item.lastUpdate)}
                  </div>
                  
                  <div className="td actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => onEditIngredient && onEditIngredient(item)}
                      title="Editar ingrediente"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => onDeleteIngredient && onDeleteIngredient(item.id)}
                      title="Eliminar ingrediente"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="table-empty">
                {searchTerm || filterStatus !== 'all' ? (
                  <div>
                    <h3>No se encontraron ingredientes</h3>
                    <p>Intenta ajustar los filtros o términos de búsqueda</p>
                  </div>
                ) : (
                  <div>
                    <h3>No hay ingredientes en el inventario</h3>
                    <p>Añade tu primer ingrediente usando el botón "Añadir ingrediente"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="table-stats">
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-label">Total items:</span>
            <span className="stat-value">{statusCounts.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Necesitan atención:</span>
            <span className="stat-value critical">
              {statusCounts.critical + statusCounts.low}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Stock adecuado:</span>
            <span className="stat-value ok">{statusCounts.ok}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTable;