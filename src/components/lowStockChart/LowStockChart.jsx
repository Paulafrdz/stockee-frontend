import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import './LowStockChart.css';

const LowStockChart = ({ data = [] }) => {

    const lowStockItems = data
        .filter(item => item.quantity > 0)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 3);

    const productNames = lowStockItems.map(item =>
        item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name
    );
    const quantities = lowStockItems.map(item => item.quantity);

    const criticalStockItems = lowStockItems.filter(item =>
        item.minimumStock && item.quantity <= item.minimumStock
    );

    if (data.length === 0) {
        return (
            <div className="low-stock-container">
                <div className="low-stock-header">
                    <h3 className="low-stock-title">Productos Bajos en Stock</h3>
                    <p className="low-stock-subtitle">Top 3 productos con menor inventario</p>
                </div>
                <div className="low-stock-empty">
                    <p>No hay productos en el inventario</p>
                </div>
            </div>
        );
    }

    if (lowStockItems.length === 0) {
        return (
            <div className="low-stock-container">
                <div className="low-stock-header">
                    <h3 className="low-stock-title">Productos Bajos en Stock</h3>
                    <p className="low-stock-subtitle">Top 3 productos con menor inventario</p>
                </div>
                <div className="low-stock-empty">
                    <p>No hay productos con stock disponible</p>
                </div>
            </div>
        );
    }

    return (
        <div className="low-stock-container">
            <div className="low-stock-header">
                <h3 className="low-stock-title">Productos Bajos en Stock</h3>
                <p className="low-stock-subtitle">
                    Productos con menor inventario
                    {criticalStockItems.length > 0 && (
                        <span className="low-stock-warning">
                            ⚠️ {criticalStockItems.length} en stock crítico
                        </span>
                    )}
                </p>
            </div>

            <div className="low-stock-chart-wrapper">
                <BarChart
                    xAxis={[
                        {
                            min: 0,
                            max: Math.max(...quantities) * 1.2,
                            tickLabelStyle: {
                                fontSize: 12,
                                fill: '#6b7280',
                            },
                        },
                    ]}
                    yAxis={[
                        {
                            scaleType: 'band',
                            data: ['Stock'],
                            tickLabelStyle: {
                                fontSize: 12,
                                fill: '#404040',
                                
                            },
                        },
                    ]}
                    series={lowStockItems.map((item, i) => ({
                        data: [item.quantity],
                        label: item.name, // 🔹 aparecerá en la leyenda
                        color: ['var(--terciary-500)', 'var(--secondary-500)', 'var(--primary-500)'][i % 3], // 🔹 colores distintos por producto
                        barSize: 10,
                    }))}
                    layout="horizontal"
                    width={400}
                    height={250}
                    margin={{ top: 10, right: 30, bottom: 30, left: 30 }}
                    grid={{ horizontal: true }}
                    borderRadius={10}
                    barGapRatio={0.5}
                    slotProps={{
                        legend: {
                            position: { vertical: 'top', horizontal: 'middle' }, // 🔹 coloca la leyenda arriba
                            labelStyle: { fontSize: 13, fontWeight: 500, fill: '#111827' },
                        },
                    }}
                />
            </div>


        </div>
    );
};

export default LowStockChart;