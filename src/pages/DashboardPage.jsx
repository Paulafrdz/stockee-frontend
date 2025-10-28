import React from 'react';
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";
import LowStockChartWrapper from '../components/lowStockChart/LowStockChartWrapper';
import TopIngredientsChart from '../components/topIngredientsChart/TopIngredientsChart';
import TopIngredientsChartWrapper from '../components/topIngredientsChart/TopIngredientsChartWrapper';
import EfficiencyCardWrapper from '../components/statsCard/EfficiencyCardWrapper';
import EfficiencyGaugeWrapper from '../components/efficiencyGauge/EfficiencyGaugeWrapper';
import WasteGaugeWrapper from '../components/wasteGauge/WasteGaugeWrapper';
import ConsumptionTrendChartWrapper from '../components/consumptionTrendChart/ConsumptionTrendChartWrapper';


const DashboardPage = () => {


    return(
        <DashboardLayout>
            <ConsumptionTrendChartWrapper></ConsumptionTrendChartWrapper>
            <LowStockChartWrapper></LowStockChartWrapper>
            <TopIngredientsChartWrapper></TopIngredientsChartWrapper>
            <EfficiencyGaugeWrapper></EfficiencyGaugeWrapper>
            <WasteGaugeWrapper></WasteGaugeWrapper>

        </DashboardLayout>
    )
};

export default DashboardPage;