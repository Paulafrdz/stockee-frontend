import React, { useState } from 'react';
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";
import LowStockChartWrapper from '../components/lowStockChart/LowStockChartWrapper';
import TopIngredientsChartWrapper from '../components/topIngredientsChart/TopIngredientsChartWrapper';
import EfficiencyGaugeWrapper from '../components/efficiencyGauge/EfficiencyGaugeWrapper';
import WasteGaugeWrapper from '../components/wasteGauge/WasteGaugeWrapper';
import ConsumptionTrendChartWrapper from '../components/consumptionTrendChart/ConsumptionTrendChartWrapper';
import './DashboardPage.css';

const DashboardPage = ({ user }) => {
      const [refreshKey, setRefreshKey] = useState(0);
    
    return (
        <DashboardLayout
            user={user}
            activeTab="dashboard"
            title="Dashboard"
            subtitle="Visualiza y analiza el rendimiento de tu inventario"
        >
            <div className='dashboard-page'>
                <div className="dashboard-page-header">
                    <div className="dashboard-page-title-section">
                        <h1 className="dashboard-page-title">Panel de Control</h1>
                    </div>
                </div>

                <div className="dashboard-page-container">
                    <div className="consumption-chart">
                        <ConsumptionTrendChartWrapper key={`consumption-${refreshKey}`}/>
                    </div>
                     <div className="ingredients-chart-item">
                        <TopIngredientsChartWrapper key={`ingredients-chart-${refreshKey}`}/>
                    </div>
                    
                      <div className="low-chart-item">
                        <LowStockChartWrapper key={`low-chart-${refreshKey}`}/>
                    </div>
                    <div className="efficiency-gauge-item">
                        <EfficiencyGaugeWrapper key={`efficiency-gauge-${refreshKey}`}/>
                    </div>
                    <div className="waste-gauge-item">
                        <WasteGaugeWrapper key={`waste-gauge-${refreshKey}`}/>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;