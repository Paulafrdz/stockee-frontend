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
import { areaElementClasses } from '@mui/x-charts';

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
      <div className='analytics-page'>
      <div className="analytics-page-header">
          <div className="anatylics-page-title-section">
            <h1 className="analytics-page-title">Eficiencia</h1>
          </div>
        </div>

      {/* Contenedor principal con Grid */}
      <div className="analytics-page-container">
        
        {/* 4 Stats Cards */}
        <div className="analytics-efficiency">
          <EfficiencyCardWrapper key={`efficiency-${refreshKey}`} />
          </div>
          <div className="analytics-totalWaste" >
          <TotalWasteCardWrapper key={`total-${refreshKey}`} />
          </div>
          <div className="analtytics-cookingError" >
          <CookingErrorsCardWrapper key={`errors-${refreshKey}`} />
          </div>
          <div className="analytics-expiredWaste" >
          <ExpiredWasteCardWrapper key={`expired-${refreshKey}`} />
        </div>

        {/* 2 Charts en paralelo */}
        <div className="analytics-charts-pie" >
          <WasteTypesPieChartWrapper key={`pie-${refreshKey}`} />
          </div>
          <div className="analytics-charts-trend" >
          <WasteTrendChartWrapper key={`trend-${refreshKey}`} />
        </div>

        {/* Tabla */}
        <div className="analytics-table-section" >
          <ProductEfficiencyWrapper key={`table-${refreshKey}`} />
        </div>

        {/* Lista */}
        <div className="analytics-list-section">
          <WasteList 
            key={`waste-list-${refreshKey}`}
            onWasteDeleted={handleWasteDeleted}
          />
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
      <WasteRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ingredients={stockIngredients}
        onWasteRegistered={handleWasteRegistered}
      />
    </DashboardLayout>
  );
};


export default AnalyticsPage;