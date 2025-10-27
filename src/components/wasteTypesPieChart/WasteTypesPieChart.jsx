import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import './WasteTypesPieChart.css';

const WasteTypesPieChart = ({ data = [] }) => {


  const reasonToCategory = (type) => {
    const map = {
      'expired': 'Caducidad',
      'burned': 'Errores Elaboración',
      'cooking errors': 'Errores Elaboración',
      'wrong-ingredient': 'Errores Elaboración',
      'over-preparation': 'Errores Elaboración',
      'natural-waste': 'Otros (Merma, Roturas)',
      'breakage': 'Otros (Merma, Roturas)',
      'other': 'Otros (Merma, Roturas)'
    };

    // Convertir a minúsculas para comparación insensible a mayúsculas
    const lowerType = type?.toLowerCase() || '';
    return map[lowerType] || 'Otros (Merma, Roturas)';
  };


  console.log('📊 Data types:', data.map(item => ({
    reason: item.reason,
    quantity: item.quantity,
    type: typeof item.quantity
  })));

  const processData = (rawData) => {
    const categories = {};

    rawData.forEach(item => {

      const category = reasonToCategory(item.type);
      const quantity = parseFloat(item.amount);
      const validQuantity = isNaN(quantity) ? 0 : quantity;


      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += validQuantity;
    });

    return Object.entries(categories)
      .map(([type, amount]) => ({
        type,
        amount: Math.round(amount * 100) / 100
      }))
      .filter(item => item.amount > 0);
  };

  const chartData = processData(data);

  // Colores específicos para cada tipo de desperdicio
  const colorMap = {
    'Caducidad': '#ec4899',
    'Errores Elaboración': '#fb923c',
    'Otros (Merma, Roturas)': '#6366f1'
  };

  // Preparar datos para el gráfico CON VALIDACIÓN
  const pieChartData = chartData
    .map((item, index) => ({
      id: index,
      value: item.amount,
      label: item.type,
      color: colorMap[item.type] || '#D7D7D7'
    }))
    .filter(item => !isNaN(item.value) && item.value > 0);

  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const dataWithPercentages = chartData.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0
  }));

  if (chartData.length === 0 || pieChartData.length === 0) {
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
            <div className="waste-pie-total-amount">{total.toFixed(1)}</div>
            <div className="waste-pie-total-label">Total kg</div>
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
              <div className="waste-pie-legend-amount">{item.amount.toFixed(1)} kg</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WasteTypesPieChart;