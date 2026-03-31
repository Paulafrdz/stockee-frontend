import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import CreateDishModal from '../components/createDishModal/CreateDishModal';
import { getStockItems } from '../services/stockService';
import FloatingButton from '../components/floatingButton/FloatingButton';
import './DishPage.css';

const DishPage = ({ user }) => {
  const [stockIngredients, setStockIngredients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchStockIngredients();
  }, []);

  const fetchStockIngredients = async () => {
    try {
      const ingredientsData = await getStockItems();
      console.log('📦 Ingredientes cargados para modal:', ingredientsData);
      setStockIngredients(ingredientsData);
    } catch (error) {
      console.error('Error fetching stock ingredients:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
 const handleWasteRegistered = (wasteData) => {
    console.log('✅ Nuevo desperdicio registrado:', wasteData);
    
    // Forzar recarga de todos los componentes
    setRefreshKey(prev => prev + 1);
    
    // Recargar ingredientes por si el stock cambió
    fetchStockIngredients();
  };
  

  
  return (
    <DashboardLayout
      user={user}
      activeTab="dish"
      title="Dish"
      subtitle="Visualiza y analiza el rendimiento de tu inventario"
    >
      <div className='analytics-page'>
      <div className="analytics-page-header">
          <div className="anatylics-page-title-section">
            <h1 className="analytics-page-title">Platos</h1>
          </div>
        </div>


      {/* Floating Button */}
      <div className="analytics-actions">
        <FloatingButton
          icon={Plus}
          variant="primary"
          size="small"
          tooltip="Registrar desperdicio"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
    </div>
      {/* Modal */}
      <CreateDishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ingredients={stockIngredients}
        onWasteRegistered={handleWasteRegistered}
      />
    </DashboardLayout>
  );
};


export default DishPage;