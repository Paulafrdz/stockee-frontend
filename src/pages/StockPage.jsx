import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import StockTable from '../components/stockTable/StockTable';
import AddIngredientModal from '../components/addIngredientModal/AddIngredientModal';
import Button from '../components/button/Button';
import './StockPage.css';
import {
  getStockItems,
  addStockItem,
  updateStockItem,
  deleteStockItem,
} from '../services/stockService';

const StockPage = () => {
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar stock desde el backend
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

  // 🔹 Añadir ingrediente (POST)
  const handleAddIngredient = async (newIngredient) => {
    try {
      const savedItem = await addStockItem({
        name: newIngredient.name,
        currentStock: parseFloat(newIngredient.currentStock),
        minimumStock: parseFloat(newIngredient.minimumStock),
        unit: newIngredient.unit,
      });
      setStockItems((prev) => [...prev, savedItem]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al añadir ingrediente:", error);
    }
  };

  // 🔹 Actualizar stock (PUT)
  const handleUpdateStock = async (itemId, newActual) => {
    try {
      const updated = await updateStockItem(itemId, newActual);
      setStockItems((prev) =>
        prev.map((item) => (item.id === itemId ? updated : item))
      );
    } catch (error) {
      console.error("Error al actualizar stock:", error);
    }
  };

  // 🔹 Eliminar ingrediente (DELETE)
  const handleDeleteIngredient = async (itemId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este ingrediente?")) {
      try {
        await deleteStockItem(itemId);
        setStockItems((prev) => prev.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Error al eliminar ingrediente:", error);
      }
    }
  };

  // 🔹 Determinar el estado del stock
  const getStockStatus = (currentStock, minimumStock) => {
    if (currentStock <= 0) return 'empty';
    if (currentStock <= minimumStock * 0.5) return 'critical';
    if (currentStock <= minimumStock) return 'low';
    return 'ok';
  };

  // 🔹 Calcular estadísticas (alertas, totales, etc.)
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
            <h1 className="page-title">Stock inventory</h1>
          </div>
        </div>

        <Button
          variant="primary"
          size="medium"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Añadir ingrediente
        </Button>

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
