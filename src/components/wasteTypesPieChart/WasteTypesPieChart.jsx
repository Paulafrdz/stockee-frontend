import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import './WasteTypesPieChart.css';

const WasteTypesPieChart = ({ data = [] }) => {
    
  const reasonToCategory = (reason) => {
    const map = {
      'caducidad': 'Caducidad',
      'quemado': 'Errores Elaboración',
      'ingrediente-incorrecto': 'Errores Elaboración', 
      'preparacion-excesiva': 'Errores Elaboración',
      'merma': 'Otros (Merma, Roturas)',
      'rotura': 'Otros (Merma, Roturas)',
      'otro': 'Otros (Merma, Roturas)'
    };
    return map[reason] || 'Otros (Merma, Roturas)';
  };

  // Procesar datos aquí también por seguridad
  const processData = (rawData) => {
    const categories = {};
    
    rawData.forEach(item => {
      const category = reasonToCategory(item.reason);
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += item.quantity;
    });

    return Object.entries(categories).map(([type, amount]) => ({
      type,
      amount: Math.round(amount * 100) / 100
    }));
  };

  // Usar datos procesados
  const chartData = processData(data);
  
  // Colores específicos para cada tipo de desperdicio
  const colorMap = {
    'Caducidad': '#ec4899',
    'Errores Elaboración': '#fb923c', 
    'Otros (Merma, Roturas)': '#6366f1'
  };

  // Preparar datos para el gráfico
  const pieChartData = chartData.map((item, index) => ({
    id: index,
    value: item.amount,
    label: item.type,
    color: colorMap[item.type] || '#D7D7D7'
  }));

  // Calcular total
  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

  // Calcular porcentajes
  const dataWithPercentages = chartData.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0
  }));

  if (chartData.length === 0) {
    return (
      <div className="waste-pie-container">
        <div className="waste-pie-header">
          <h3 className="waste-pie-title">Tipos de Desperdicio</h3>
          <p className="waste-pie-subtitle">Distribución por categoría</p>
        </div>
        <div className="waste-pie-empty">
          <p>No hay datos de desperdicios registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="waste-pie-container">
      <div className="waste-pie-header">
        <h3 className="waste-pie-title">Tipos de Desperdicio</h3>
        <p className="waste-pie-subtitle">Distribución por categoría</p>
      </div>

      <div className="waste-pie-content">
        <div className="waste-pie-chart-wrapper">
          <PieChart
            series={[
              {
                data: pieChartData,
                innerRadius: 60,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -10 },
              },
            ]}
            width={250}
            height={250}
            slotProps={{
              legend: { hidden: true },
            }}
          />
          <div className="waste-pie-total-overlay">
            <div className="waste-pie-total-amount">{total}</div>
            <div className="waste-pie-total-label">Total {chartData[0]?.amount?.toString().includes('.') ? 'kg' : 'un'}</div>
          </div>
        </div>

        <div className="waste-pie-legend">
          {dataWithPercentages.map((item, index) => (
            <div key={index} className="waste-pie-legend-item">
              <div className="waste-pie-legend-row">
                <div className="waste-pie-legend-info">
                  <span 
                    className="waste-pie-legend-dot" 
                    style={{ backgroundColor: colorMap[item.type] }}
                  />
                  <span className="waste-pie-legend-label">{item.type}</span>
                </div>
                <span className="waste-pie-legend-percentage">{item.percentage}%</span>
              </div>
              <div className="waste-pie-legend-amount">{item.amount} un</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WasteTypesPieChart;