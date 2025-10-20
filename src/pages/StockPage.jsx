import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import StockTable from '../components/stockTable/StockTable'
import AddIngredientModal from '../components/addIngredientModal/AddIngredientModal';
import './StockPage.css';

const StockPage = () => {
  // Estados principales
  const [stockItems, setStockItems] = useState([
    {
      id: 1,
      ingredient: 'Tomates',
      actual: 2.5,
      minimo: 5,
      unidad: 'kg',
      ultimaActualizacion: '2h ago'
    },
    {
      id: 2,
      ingredient: 'Mozzarella',
      actual: 4,
      minimo: 3,
      unidad: 'kg',
      ultimaActualizacion: '5h ago'
    },
    {
      id: 3,
      ingredient: 'Aceite de oliva',
      actual: 1.5,
      minimo: 2,
      unidad: 'L',
      ultimaActualizacion: '1d ago'
    }
  ]);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funciones para manejar los items
  const handleAddIngredient = (newIngredient) => {
    const newItem = {
      id: Date.now(),
      ingredient: newIngredient.name,
      actual: parseFloat(newIngredient.currentStock),
      minimo: parseFloat(newIngredient.minimumStock),
      unidad: newIngredient.unit,
      ultimaActualizacion: 'ahora'
    };
    
    setStockItems(prev => [...prev, newItem]);
    setIsModalOpen(false);
  };

  const handleUpdateStock = (itemId, newActual) => {
    setStockItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, actual: newActual, ultimaActualizacion: 'ahora' }
          : item
      )
    );
  };

  const handleDeleteIngredient = (itemId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
      setStockItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  // Función para determinar el estado del stock
  const getStockStatus = (actual, minimo) => {
    if (actual <= 0) return 'empty';
    if (actual <= minimo * 0.5) return 'critical';
    if (actual <= minimo) return 'low';
    return 'ok';
  };

  // Calcular estadísticas para el alert banner
  const statusCounts = stockItems.reduce((acc, item) => {
    const status = getStockStatus(item.actual, item.minimo);
    acc[status] = (acc[status] || 0) + 1;
    acc.total = stockItems.length;
    return acc;
  }, { empty: 0, critical: 0, low: 0, ok: 0, total: 0 });

  const needsAttention = statusCounts.empty + statusCounts.critical + statusCounts.low;

  return (
    <DashboardLayout>
      <div className="stock-page">
        {/* Header */}
        <div className="stock-page-header">
          <div className="page-title-section">
            <h1 className="page-title">Stock inventory</h1>
            
          </div>

         
        </div>

        {/* Table Container */}
        <div className="stock-content">
          <StockTable
            stockItems={stockItems}
            onUpdateStock={handleUpdateStock}
            onDeleteIngredient={handleDeleteIngredient}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AddIngredientModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddIngredient}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default StockPage;