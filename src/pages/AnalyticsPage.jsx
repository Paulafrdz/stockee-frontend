import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import TotalWasteCardWrapper from '../components/statsCard/TotalWasteCardWrapper';
import ExpiredWasteCardWrapper from '../components/statsCard/ExpiredWasteCardWrapper';
import CookingErrorsCardWrapper from '../components/statsCard/CookingErrorsCardWrapper';
import EfficiencyCardWrapper from '../components/statsCard/EfficiencyCardWrapper';
import WasteTypesPieChartWrapper from '../components/wasteTypesPieChart/WasteTypesPieChartWrapper';
import WasteTrendChartWrapper from '../components/wasteTrendChart/WasteTrendChartWrapper';
import ProductEfficiencyWrapper from '../components/productEfficiencyTable/ProductEfficiencyWrapper';
import WasteList from '../components/wasteList/WasteList';
import WasteRegistrationModal from '../components/wasteRegistrationModal/WasteRegistrationModal';
import { getStockItems } from '../services/stockService';
import FloatingButton from '../components/floatingButton/FloatingButton';
import './AnalyticsPage.css';

const AnalyticsPage = ({ user }) => {
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

  const handleWasteDeleted = (wasteId) => {
    console.log('🗑️ Desperdicio eliminado:', wasteId);
    
    // Forzar recarga de componentes
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout
      user={user}
      activeTab="analytics"
      title="Analytics"
      subtitle="Visualiza y analiza el rendimiento de tu inventario"
    >
      <div className="analytics-page-container">
        
        {/* Botón para registrar desperdicio */}
        <div className="analytics-actions">
          <FloatingButton
                    icon={Plus}
                    variant="primary"
                    size="large"
                    position="bottom-right"
                    tooltip="Añadir ingrediente a la orden"
                    onClick={() => setIsModalOpen(true)}
                />
        </div>

        {/* Stats Cards con DATOS REALES */}
        <div className="analytics-stats-grid">
          <EfficiencyCardWrapper key={`efficiency-${refreshKey}`} />
          <TotalWasteCardWrapper key={`total-${refreshKey}`} />
          <CookingErrorsCardWrapper key={`errors-${refreshKey}`} />
          <ExpiredWasteCardWrapper key={`expired-${refreshKey}`} />
        </div>

        {/* Charts Grid con DATOS REALES */}
        <div className="analytics-charts-grid">
          <WasteTypesPieChartWrapper key={`pie-${refreshKey}`} />
          <WasteTrendChartWrapper key={`trend-${refreshKey}`} />
        </div>

        {/* Product Efficiency Table con DATOS REALES */}
        <div className="analytics-table-section">
          <ProductEfficiencyWrapper key={`table-${refreshKey}`} />
        </div>

        {/* Waste List con DATOS REALES */}
        <div className="analytics-list-section">
          <WasteList 
            key={`waste-list-${refreshKey}`}
            onWasteDeleted={handleWasteDeleted}
          />
        </div>

      </div>

      {/* Modal de Registro de Desperdicio */}
      <WasteRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ingredients={stockIngredients}
        onWasteRegistered={handleWasteRegistered}
        
      />
    </DashboardLayout>
  );
};

export default AnalyticsPage;