import React, { useState, useEffect } from 'react';
import { getAllWaste, deleteWaste } from '../../services/wasteService';
import './WasteList.css';

const WasteList = ({ onWasteDeleted }) => {
  const [wasteItems, setWasteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('24h'); // '24h', 'week', 'month', 'all'

  useEffect(() => {
    fetchWasteItems();
  }, []);

  const fetchWasteItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllWaste();
      console.log('📦 Datos recibidos del backend:', data); 
      
      const validatedData = data.map(item => ({
        id: item.id,
        ingredientId: item.ingredientId,
        ingredientName: item.ingredientName || 'Ingrediente desconocido',
        quantity: item.quantity || 0,
        unit: item.unit || 'unidades',
        reason: item.reason || 'other',
        details: item.details || '',
        timestamp: item.timestamp
      }));
      
      setWasteItems(validatedData);
    } catch (error) {
      console.error('❌ Error cargando desperdicios:', error);
      setError('Error al cargar los desperdicios: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredWasteItems = () => {
    const now = new Date();
    
    return wasteItems.filter(item => {
      const itemDate = new Date(item.timestamp);
      const timeDiff = now - itemDate;
      
      switch (timeFilter) {
        case '24h':
          return timeDiff <= (24 * 60 * 60 * 1000); 
        case 'week':
          return timeDiff <= (7 * 24 * 60 * 60 * 1000); 
        case 'month':
          return timeDiff <= (30 * 24 * 60 * 60 * 1000); 
        case 'all':
        default:
          return true; 
      }
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const handleDelete = async (wasteId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      return;
    }

    try {
      await deleteWaste(wasteId);
      setWasteItems(prev => prev.filter(item => item.id !== wasteId));
      
      if (onWasteDeleted) {
        onWasteDeleted(wasteId);
      }
      
      alert('✅ Registro eliminado correctamente');
    } catch (error) {
      console.error('❌ Error eliminando desperdicio:', error);
      alert('Error al eliminar el registro: ' + error.message);
    }
  };

  const getReasonEmoji = (reason) => {
    const emojiMap = {
      'expired': '📅',
      'burned': '🔥',
      'wrong-ingredient': '❌',
      'breakage': '💥',
      'natural-waste': '💧',
      'over-preparation': '🍽️',
      'other': '💠'
    };
    return emojiMap[reason] || '📦';
  };

  const getReasonLabel = (reason) => {
    const labelMap = {
      'expired': 'Caducidad',
      'burned': 'Error - Quemado',
      'wrong-ingredient': 'Error - Ingrediente incorrecto',
      'breakage': 'Rotura/Caída',
      'natural-waste': 'Merma Natural',
      'over-preparation': 'Preparación Excesiva',
      'other': 'Otro'
    };
    return labelMap[reason] || reason;
  };

  const getReasonColor = (reason) => {
    const colorMap = {
      'expired': 'reason-expired',
      'burned': 'reason-error',
      'wrong-ingredient': 'reason-error',
      'breakage': 'reason-breakage',
      'natural-waste': 'reason-natural-waste',
      'over-preparation': 'reason-over-preparation',
      'other': 'reason-other'
    };
    return colorMap[reason] || 'reason-default';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace menos de 1h';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Ayer';
      return `Hace ${diffInDays}d`;
    }
  };

  const calculateTotalQuantity = () => {
    const filtered = getFilteredWasteItems();
    return filtered.reduce((sum, item) => sum + item.quantity, 0).toFixed(2);
  };

  const filteredItems = getFilteredWasteItems();

  if (isLoading) {
    return (
      <div className="waste-list-container">
        <div className="waste-list-loading">
          <div className="waste-list-spinner"></div>
          <p>Cargando desperdicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="waste-list-container">
        <div className="waste-list-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchWasteItems} className="waste-list-retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="waste-list-container">
        <div className="waste-list-header">
          <h2 className="waste-list-title">Registro de Desperdicios</h2>
          <div className="waste-list-filters">
            <select  
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="waste-filter-select"
            >
              <option value="24h">Últimas 24h</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
        <div className="waste-list-empty">
          <div className="waste-list-empty-icon">📊</div>
          <h3>No hay desperdicios registrados</h3>
          <p>Los desperdicios que registres aparecerán aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="waste-list-container">
      <div className="waste-list-header">
        <div className="waste-list-title-section">
          <h2 className="waste-list-title">Registro de Desperdicios</h2>
          <p className="waste-list-subtitle">
            {filteredItems.length} registro(s) encontrado(s)
          </p>
        </div>
        <div className="waste-list-filters">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="waste-filter-select"
          >
            <option value="24h">Últimas 24h</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>

      <div className="waste-list-items">
        {filteredItems.map((item) => (
          <div key={item.id} className="waste-list-card">
            <div className="waste-card-icon">
              <span className={`waste-icon-badge ${getReasonColor(item.reason)}`}>
                {getReasonEmoji(item.reason)}
              </span>
            </div>

            <div className="waste-card-content">
              <div className="waste-card-header">
                <h4 className="waste-card-ingredient">
                  {item.ingredientName}
                </h4>
                <span className="waste-card-time">{formatDate(item.timestamp)}</span>
              </div>

              <div className="waste-card-details">
                <div className="waste-card-quantity">
                  <strong>{item.quantity} {item.unit}</strong>
                </div>
                <span className={`waste-card-reason ${getReasonColor(item.reason)}`}>
                  {getReasonLabel(item.reason)}
                </span>
                
                {item.details && (
                  <p className="waste-card-description">{item.details}</p>
                )}
              </div>
            </div>

            <div className="waste-card-actions">
              <button
                className="waste-card-delete-btn"
                onClick={() => handleDelete(item.id)}
                aria-label="Eliminar"
                title="Eliminar registro"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="waste-list-footer">
        <div className="waste-list-total">
          <span>Total desperdiciado:</span>
          <strong>{calculateTotalQuantity()} unidades</strong>
        </div>
      </div>
    </div>
  );
};

export default WasteList;