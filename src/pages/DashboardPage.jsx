import React from 'react';
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";
import LowStockChartWrapper from '../components/lowStockChart/LowStockChartWrapper';


const DashboardPage = () => {


    return(
        <DashboardLayout>
            <LowStockChartWrapper></LowStockChartWrapper>

        </DashboardLayout>
    )
};

export default DashboardPage;