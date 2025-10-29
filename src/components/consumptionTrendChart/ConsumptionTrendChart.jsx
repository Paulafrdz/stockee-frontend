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
          margin={{ left: 10}}
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
    </div>
  );
};

export default ConsumptionTrendChart;