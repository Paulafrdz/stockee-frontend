import React from 'react';
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";
import LowStockChartWrapper from '../components/lowStockChart/LowStockChartWrapper';
import TopIngredientsChart from '../components/topIngredientsChart/TopIngredientsChart';
import TopIngredientsChartWrapper from '../components/topIngredientsChart/TopIngredientsChartWrapper';


const DashboardPage = () => {


    return(
        <DashboardLayout>
            <LowStockChartWrapper></LowStockChartWrapper>
            <TopIngredientsChartWrapper></TopIngredientsChartWrapper>

        </DashboardLayout>
    )
};

export default DashboardPage;