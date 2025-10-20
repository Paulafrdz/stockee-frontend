import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import StockTable from '../components/stockTable/StockTable'
import AddIngredientModal from '../components/addIngredientModal/AddIngredientModal';
import Button from '../components/button/Button';
import './StockPage.css';

const StockPage = () => {
  // Estados principales
  const [stockItems, setStockItems] = useState([
    {
      id: 1,
      name: 'Tomates',
      currentStock: 2.5,
      minimumStock: 5,
      unit: 'kg',
      lastUpdate: '2h ago'
    },
    {
      id: 2,
      name: 'Mozzarella',
      currentStock: 4,
      minimumStock: 3,
      unit: 'kg',
      lastUpdate: '5h ago'
    },
    {
      id: 3,
      name: 'Aceite de oliva',
      currentStock: 1.5,
      minimumStock: 2,
      unit: 'L',
      lastUpdate: '1d ago'
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
      name: newIngredient.name,
      currentStock: parseFloat(newIngredient.currentStock),
      minimumStock: parseFloat(newIngredient.minimumStock),
      unit: newIngredient.unit,
      lastUpdate: 'ahora'
    };
    
    setStockItems(prev => [...prev, newItem]);
    setIsModalOpen(false);
  };

  const handleUpdateStock = (itemId, newActual) => {
    setStockItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, currentStock: newActual, lastUpdate: 'ahora' }
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
  const getStockStatus = (currentStock, minimumStock) => {
    if (currentStock <= 0) return 'empty';
    if (currentStock <= minimumStock * 0.5) return 'critical';
    if (currentStock <= minimumStock) return 'low';
    return 'ok';
  };

  // Calcular estadísticas para el alert banner
  const statusCounts = stockItems.reduce((acc, item) => {
    const status = getStockStatus(item.currentStock, item.minimumStock);
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
         <Button
            variant="primary"
            size="medium"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            + Añadir ingrediente
          </Button>

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