import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './ConsumptionTrendChart.css';

const ConsumptionTrendChart = ({ data = [] }) => {
  // data tendrá: { month: 'Ene', totalConsumption: 45.5, topIngredients: [...] }
  const months = data.map(item => item.month);
  const consumptionValues = data.map(item => item.totalConsumption);

  // Encontrar el ingrediente más consumido para destacarlo
  const allTopIngredients = data.flatMap(item => item.topIngredients || []);
  const mostConsumedIngredient = allTopIngredients.reduce((max, ing) => 
    ing.consumed > (max?.consumed || 0) ? ing : max, null
  );

  if (data.length === 0) {
    return (
      <div className="ingredients-consumption-container">
        <div className="ingredients-consumption-header">
          <h3 className="ingredients-consumption-title">Consumo de Ingredientes</h3>
          <p className="ingredients-consumption-subtitle">Evolución del consumo mensual</p>
        </div>
        <div className="ingredients-consumption-empty">
          <p>No hay datos de consumo disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ingredients-consumption-container">
      <div className="ingredients-consumption-header">
        <h3 className="ingredients-consumption-title">Consumo de Ingredientes</h3>
      </div>

      <div className="ingredients-consumption-chart-wrapper">
        <LineChart
          xAxis={[
            {
              scaleType: 'point',
              data: months,
              tickLabelStyle: {
                fontSize: 12,
                fill: '#404040',
              },
            },
          ]}
          yAxis={[
            {
              label: 'Kg consumidos',
              tickLabelStyle: {
                fontSize: 12,
                fill: '#404040',
              },
            },
          ]}
          series={[
            {
              data: consumptionValues,
              label: 'Consumo Total',
              color: '#6366f1',
              curve: 'natural',
              showMark: true,
              area: true,
            },
          ]}
          width={700}
          height={350}
          margin={{ top: 40, right: 30, bottom: 40, left: 60 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'top', horizontal: 'middle' },
              padding: 0,
              labelStyle: {
                fontSize: 12,
              },
            },
          }}
        />
      </div>

      {/* Estadísticas mensuales */}
      <div className="ingredients-consumption-stats">
        <div className="consumption-stat">
          <span className="stat-label">Consumo promedio:</span>
          <span className="stat-value">
            {Math.round(consumptionValues.reduce((a, b) => a + b, 0) / consumptionValues.length)} kg/mes
          </span>
        </div>
        <div className="consumption-stat">
          <span className="stat-label">Máximo consumo:</span>
          <span className="stat-value">
            {Math.max(...consumptionValues)} kg
          </span>
        </div>
        <div className="consumption-stat">
          <span className="stat-label">Período analizado:</span>
          <span className="stat-value">
            {data.length} meses
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionTrendChart;