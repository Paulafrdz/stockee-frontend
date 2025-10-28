import React from 'react';
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";
import LowStockChartWrapper from '../components/lowStockChart/LowStockChartWrapper';
import TopIngredientsChart from '../components/topIngredientsChart/TopIngredientsChart';
import TopIngredientsChartWrapper from '../components/topIngredientsChart/TopIngredientsChartWrapper';
import EfficiencyCardWrapper from '../components/statsCard/EfficiencyCardWrapper';
import EfficiencyGaugeWrapper from '../components/efficiencyGauge/EfficiencyGaugeWrapper';


const DashboardPage = () => {


    return(
        <DashboardLayout>
            <LowStockChartWrapper></LowStockChartWrapper>
            <TopIngredientsChartWrapper></TopIngredientsChartWrapper>
            <EfficiencyGaugeWrapper></EfficiencyGaugeWrapper>

        </DashboardLayout>
    )
};

export default DashboardPage;