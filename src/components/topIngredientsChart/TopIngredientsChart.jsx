import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import './TopIngredientsChart.css';

const TopIngredientsChart = ({ data = [] }) => {

    const topIngredients = data.slice(0, 3);

    const ingredientNames = topIngredients.map(item =>
        item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name
    );
    const consumedAmounts = topIngredients.map(item => item.consumed);


    if (data.length === 0) {
        return (
            <div className="top-ingredients-container">
                <div className="top-ingredients-header">
                    <h3 className="top-ingredients-title">Ingredientes Más Consumidos</h3>
                    <p className="top-ingredients-subtitle">Top 3 ingredientes</p>
                </div>
                <div className="top-ingredients-empty">
                    <p>No hay datos de consumo disponibles</p>
                </div>
            </div>
        );
    }

    if (topIngredients.length === 0) {
        return (
            <div className="top-ingredients-container">
                <div className="top-ingredients-header">
                    <h3 className="top-ingredients-title">Ingredientes Más Consumidos</h3>
                    <p className="top-ingredients-subtitle">Top 3 ingredientes</p>
                </div>
                <div className="top-ingredients-empty">
                    <p>No se encontraron ingredientes consumidos</p>
                </div>
            </div>
        );
    }

    return (
        <div className="top-ingredients-container">
            <div className="top-ingredients-header">
                <h3 className="top-ingredients-title">Ingredientes más consumidos</h3>
                <p className="top-ingredients-subtitle">
                    <span className="top-ingredients-total">
                        Total registros: {data.length}
                    </span>
                </p>
            </div>

            <div className="top-ingredients-content">
                <div className="top-ingredients-chart-wrapper">
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: ingredientNames }]}
                        series={[
                            {
                                data: consumedAmounts,
                                color: '#6366f1',
                            },
                        ]}
                        width={400}
                        height={300}
                        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                        borderRadius={100}
                        groupPadding={0}
                        slotProps={{
                            legend: { hidden: true },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopIngredientsChart;