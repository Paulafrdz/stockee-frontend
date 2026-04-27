import { useState } from 'react';
import { Edit, Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import StockFilters from '../stockFilters/StockFilters';
import './StockTable.css';
import { getLotesByStockId } from '../../services/stockService';

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

  const [expandedRow, setExpandedRow] = useState(null);
  const [lotesMap, setLotesMap] = useState({});

  const getStockStatus = (currentStock, minimumStock) => {
    if (currentStock <= minimumStock * 0.5) return 'critical';
    if (currentStock <= minimumStock * 1.5) return 'low';
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

  const toggleLotes = async (itemId) => {
    if (expandedRow === itemId) {
      setExpandedRow(null);
      return;
    }
    if (!lotesMap[itemId]) {
      const lotes = await getLotesByStockId(itemId);
      setLotesMap(prev => ({ ...prev, [itemId]: lotes }));
    }
    setExpandedRow(itemId);
  };

  // Panel reutilizable — vive dentro del mismo <tr>
  const LotesPanel = ({ item }) => (
    <td colSpan={7} className="lotes-inline-panel" id={`lotes-${item.id}`}>
      {lotesMap[item.id]?.length > 0 ? (
        <ul className="lotes-panel" aria-label={`Lotes de ${item.name}`}>
          {lotesMap[item.id].map(lote => (
            <li key={lote.id} className="lote-row">
              <span className="lote-label">Cantidad</span>
              <span className="lote-qty">{lote.quantity} {lote.unit}</span>
              <span className="lote-label">Caducidad</span>
              <span className="lote-expiry">
                {new Date(lote.expiryDate).toLocaleDateString('es-ES')}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="lotes-empty">Sin lotes registrados</p>
      )}
    </td>
  );

  const badgesRendered = new Set();

  return (
    <div className="stock-table-container">

      {(statusCounts.critical > 0 || statusCounts.low > 0) && (
        <div className="stock-alert-banner" role="alert">
          <AlertTriangle className="alert-icon" size={20} aria-hidden="true" />
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

      <StockFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filterStatus={filterStatus}
        onFilterChange={onFilterChange}
        statusCounts={statusCounts}
        totalLabel="Total"
        filterLabels={{ critical: 'Crítico', low: 'Low', ok: 'Ok' }}
        searchPlaceholder="Buscar ingredientes..."
      />

      <div className="stock-table">
        <table aria-label="Inventario de ingredientes">
          <caption className="sr-only">
            Tabla de ingredientes con stock actual, mínimo, unidad y estado
          </caption>

          <thead className="table-head">
            <tr>
              <th scope="col" className="th">Ingredientes</th>
              <th scope="col" className="th">Actual</th>
              <th scope="col" className="th">Mínimo</th>
              <th scope="col" className="th">Unidad</th>
              <th scope="col" className="th">Estado</th>
              <th scope="col" className="th">Caducidad</th>
              <th scope="col" className="th"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>

          <tbody className="table-body">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {

                const badgeId = !badgesRendered.has(item.status)
                  ? (badgesRendered.add(item.status), `stock-badge-${item.status}`)
                  : undefined;

                return (
                  <tr
                    key={item.id}
                    className={`table-row status-row-${item.status}`}
                    aria-expanded={expandedRow === item.id}
                  >
                    <td className="td stock-ingredient-name">{item.name}</td>

                    <td className="td stock-currentStock">
                      <span className={`stock-value stock-${item.status}`}>
                        {item.currentStock}
                      </span>
                    </td>

                    <td className="td stock-minimum">{item.minimumStock}</td>

                    <td className="td stock-unit">{item.unit}</td>

                    <td className="td stock-status">
                      <span
                        id={badgeId}
                        className={`status-badge status-${item.status}`}
                        >
                        {item.statusLabel}
                      </span>
                    </td>

                    <td className="td lotes-cell">
                      <button
                        className="lotes-toggle-btn"
                        onClick={() => toggleLotes(item.id)}
                        aria-expanded={expandedRow === item.id}
                        aria-controls={`lotes-${item.id}`}
                        aria-label={`${expandedRow === item.id ? 'Ocultar' : 'Ver'} lotes de ${item.name}`}
                      >
                        {expandedRow === item.id
                          ? <ChevronUp size={16} aria-hidden="true" />
                          : <ChevronDown size={16} aria-hidden="true" />
                        }
                      </button>
                    </td>

                    <td className="td actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEditIngredient && onEditIngredient(item)}
                        aria-label={`Editar ${item.name}`}
                      >
                        <Edit size={16} aria-hidden="true" />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDeleteIngredient && onDeleteIngredient(item.id)}
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </td>

                    {/* Panel de lotes — inline dentro del mismo <tr> */}
                    {expandedRow === item.id && <LotesPanel item={item} />}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="table-empty">
                  {searchTerm || filterStatus !== 'all' ? (
                    <>
                      <h3>No se encontraron ingredientes</h3>
                      <p>Intenta ajustar los filtros o términos de búsqueda</p>
                    </>
                  ) : (
                    <>
                      <h3>No hay ingredientes en el inventario</h3>
                      <p>Añade tu primer ingrediente usando el botón "Añadir ingrediente"</p>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-stats" aria-label="Resumen del inventario">
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