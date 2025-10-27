import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import StockTable from '../components/stockTable/StockTable';
import AddIngredientModal from '../components/addIngredientModal/AddIngredientModal';
import FloatingButton from '../components/floatingButton/FloatingButton';
import './StockPage.css';
import {
  getStockItems,
  addStockItem,
  updateStockItem,
  updateStockOnly,
  deleteStockItem,
} from '../services/stockService';

const StockPage = () => {
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar stock desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStockItems();
        setStockItems(data);
      } catch (error) {
        console.error("Error al obtener el stock:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Añadir ingrediente (POST)
  const handleAddIngredient = async (newIngredient) => {
    try {
      const savedItem = await addStockItem({
        name: newIngredient.name,
        currentStock: parseFloat(newIngredient.currentStock),
        minimumStock: parseFloat(newIngredient.minimumStock),
        unit: newIngredient.unit,
      });
      setStockItems((prev) => [...prev, savedItem]);
      handleCloseModal();
    } catch (error) {
      console.error("Error al añadir ingrediente:", error);
      throw error; // Re-throw para que el modal pueda manejar el error
    }
  };

  // Actualizar ingrediente completo (PUT) - desde modal de edición
  const handleUpdateIngredient = async (ingredientData) => {
    try {
      console.log('🔍 handleUpdateIngredient - Data recibida:', ingredientData);

      // Extraer el ID y crear objeto sin ID para el body
      const { id, ...dataToSend } = ingredientData;
      console.log('🔍 handleUpdateIngredient - ID:', id);
      console.log('🔍 handleUpdateIngredient - Data a enviar:', dataToSend);

      const updated = await updateStockItem(id, dataToSend);
      setStockItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error al actualizar ingrediente:", error);
      throw error; // Re-throw para que el modal pueda manejar el error
    }
  };

  // Actualización rápida solo del stock (para edición inline en tabla)
  const handleQuickStockUpdate = async (itemId, newStock) => {
    try {
      const updated = await updateStockOnly(itemId, parseFloat(newStock));
      setStockItems((prev) =>
        prev.map((item) => (item.id === itemId ? updated : item))
      );
    } catch (error) {
      console.error("Error al actualizar stock:", error);
    }
  };

  const handleDeleteIngredient = async (itemId) => {
    try {
      await deleteStockItem(itemId);
      setStockItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error al eliminar ingrediente:", error);
    }

  };

  const getStockStatus = (currentStock, minimumStock) => {
    if (typeof currentStock !== 'number' || typeof minimumStock !== 'number') {
      return 'unknown';
    }

    if (minimumStock <= 0) {
      return currentStock <= 0 ? 'empty' : 'ok';
    }

    if (currentStock <= 0) return 'empty';
    if (currentStock <= minimumStock * 0.5) return 'critical';
    if (currentStock <= minimumStock) return 'low';
    return 'ok';
  };

  // Calcular estadísticas (alertas, totales, etc.)
  const statusCounts = stockItems.reduce(
    (acc, item) => {
      const status = getStockStatus(item.currentStock, item.minimumStock);
      acc[status] = (acc[status] || 0) + 1;
      acc.total = stockItems.length;
      return acc;
    },
    { empty: 0, critical: 0, low: 0, ok: 0, total: 0 }
  );

  const needsAttention = statusCounts.empty + statusCounts.critical + statusCounts.low;

  useEffect(() => {
  const checkRefresh = () => {
    const refreshTime = localStorage.getItem('refreshStock');
    if (refreshTime) {
      console.log('🔁 Refrescando stock tras pedido...');
      getStockItems().then(setStockItems);
      localStorage.removeItem('refreshStock');
    }
  };

  window.addEventListener('focus', checkRefresh); 
  const interval = setInterval(checkRefresh, 3000); 

  return () => {
    window.removeEventListener('focus', checkRefresh);
    clearInterval(interval);
  };
}, []);


  if (loading) {
    return (
      <DashboardLayout>
        <div className="stock-page">
          <h2>Cargando inventario...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="stock-page">
        <div className="stock-page-header">
          <div className="page-title-section">
            <h1 className="page-title">Inventario</h1>
          </div>
        </div>

        <FloatingButton
          variant="primary"
          size="small"
          icon={Plus}
          onClick={() => handleOpenModal()}
        >
         
        </FloatingButton>

        <div className="stock-content">
          <StockTable
            stockItems={stockItems}
            onEditIngredient={handleOpenModal}
            onUpdateStock={handleQuickStockUpdate}
            onDeleteIngredient={handleDeleteIngredient}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </div>

        {isModalOpen && (
          <AddIngredientModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={editingItem ? handleUpdateIngredient : handleAddIngredient}
            initialData={editingItem}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default StockPage;