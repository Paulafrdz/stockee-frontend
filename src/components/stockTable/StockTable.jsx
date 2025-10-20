import React from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import StockFilters from '../stockFilters/StockFilters';
import './StockTable.css';

const StockTable = ({ 
  stockItems = [], 
  onUpdateStock, 
  onDeleteIngredient,
  searchTerm = '',
  onSearchChange,
  filterStatus = 'all',
  onFilterChange 
}) => {
  // Función para determinar el estado del stock
  const getStockStatus = (actual, minimo) => {
    if (actual <= 0) return 'empty';
    if (actual <= minimo * 0.5) return 'critical';
    if (actual <= minimo) return 'low';
    return 'ok';
  };

  // Función para obtener el label del estado
  const getStatusLabel = (status) => {
    switch (status) {
      case 'empty': return 'Vacío';
      case 'critical': return 'Crítico';
      case 'low': return 'Low';
      case 'ok': return 'Ok';
      default: return 'Ok';
    }
  };

  // Procesar items con estado calculado
  const processedItems = stockItems.map(item => ({
    ...item,
    status: getStockStatus(item.actual, item.minimo),
    statusLabel: getStatusLabel(getStockStatus(item.actual, item.minimo))
  }));

  // Filtrar items según búsqueda y filtros
  const filteredItems = processedItems.filter(item => {
    const matchesSearch = item.ingredient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Contar items por estado
  const statusCounts = {
    empty: processedItems.filter(item => item.status === 'empty').length,
    critical: processedItems.filter(item => item.status === 'critical').length,
    low: processedItems.filter(item => item.status === 'low').length,
    ok: processedItems.filter(item => item.status === 'ok').length,
    total: processedItems.length
  };

  const handleStockUpdate = (itemId, newActual) => {
    if (onUpdateStock) {
      onUpdateStock(itemId, parseFloat(newActual));
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (timestamp === 'ahora') return 'ahora';
    return timestamp;
  };

  return (
    <div className="stock-table-container">
      {/* Alert Banner */}
      {(statusCounts.empty > 0 || statusCounts.critical > 0 || statusCounts.low > 0) && (
        <div className="stock-alert-banner">
          <AlertTriangle className="alert-icon" size={20} />
          <div className="alert-content">
            <div className="alert-title">
              {statusCounts.empty + statusCounts.critical + statusCounts.low} items necesitan atención
            </div>
            <div className="alert-text">
              {statusCounts.empty > 0 && `${statusCounts.empty} vacíos, `}
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
          empty: 'Vacío',
          critical: 'Crítico',
          low: 'Low',
          ok: 'Ok'
        }}
        searchPlaceholder="Buscar ingredientes..."
      />

      {/* Table */}
      <div className="stock-table">
        <div className="table-header">
          <div className="table-title">Inventario de Stock</div>
        </div>

        <div className="table-content">
          <div className="table-head">
            <div className="th">Ingredientes</div>
            <div className="th">Actual</div>
            <div className="th">Mínimo</div>
            <div className="th">Unidad</div>
            <div className="th">Estado</div>
            <div className="th">Última actualización</div>
            <div className="th">Acciones</div>
          </div>

          <div className="table-body">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className={`table-row status-row-${item.status}`}>
                  <div className="td ingredient-name">
                    {item.ingredient}
                  </div>
                  
                  <div className="td stock-actual">
                    <span className={`stock-value stock-${item.status}`}>
                      {item.actual}
                    </span>
                  </div>
                  
                  <div className="td stock-minimum">
                    {item.minimo}
                  </div>
                  
                  <div className="td stock-unit">
                    {item.unidad}
                  </div>
                  
                  <div className="td stock-status">
                    <span className={`status-badge status-${item.status}`}>
                      {item.statusLabel}
                    </span>
                  </div>
                  
                  <div className="td last-updated text-muted">
                    {formatTimeAgo(item.ultimaActualizacion)}
                  </div>
                  
                  <div className="td actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => {/* TODO: Abrir modal de edición */}}
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
              {statusCounts.empty + statusCounts.critical + statusCounts.low}
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