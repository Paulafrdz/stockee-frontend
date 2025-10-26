// WasteTrendChart.jsx MEJORADO
import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './WasteTrendChart.css';

const WasteTrendChart = ({ data = [] }) => {
  // Validar y procesar datos
  const validData = Array.isArray(data) ? data : [];
  
  const months = validData.map(item => item.month || '');
  const values = validData.map(item => typeof item.value === 'number' ? item.value : 0);

  // Calcular estadísticas útiles
  const totalWaste = values.reduce((sum, value) => sum + value, );
  const averageWaste = validData.length > 0 ? totalWaste / validData.length : 0;
  const maxWaste = Math.max(...values, 0);

  if (validData.length === 0 || totalWaste === 0) {
    return (
      <div className="waste-trend-container">
        <div className="waste-trend-header">
          <h3 className="waste-trend-title">Tendencia de Desperdicio</h3>
          <p className="waste-trend-subtitle">Últimos 6 meses</p>
        </div>
        <div className="waste-trend-empty">
          <div className="waste-trend-empty-icon">📊</div>
          <p>No hay suficientes datos de desperdicios</p>
          <small>Los datos aparecerán cuando registres desperdicios</small>
        </div>
      </div>
    );
  }

  return (
    <div className="waste-trend-container">
      <div className="waste-trend-header">
        <div className="waste-trend-title-section">
          <h3 className="waste-trend-title">Tendencia de Desperdicio</h3>
          <p className="waste-trend-subtitle">Últimos 6 meses</p>
        </div>
        <div className="waste-trend-stats">
          <div className="waste-trend-stat">
            <span className="waste-trend-stat-label">Total</span>
            <span className="waste-trend-stat-value">{totalWaste.toFixed(1)}</span>
          </div>
          <div className="waste-trend-stat">
            <span className="waste-trend-stat-label">Promedio/mes</span>
            <span className="waste-trend-stat-value">{averageWaste.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="waste-trend-chart-wrapper">
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
              tickLabelStyle: {
                fontSize: 12,
                fill: '#404040',
              },
              min: 0,
              max: Math.ceil(maxWaste * 1.1), // Margen del 10% arriba
            },
          ]}
          series={[
            {
              data: values,
              color: '#ec4899',
              area: true,
              showMark: true,
              curve: 'natural',
              valueFormatter: (value) => `${value?.toFixed(1) || 0}`,
            },
          ]}
          width={600}
          height={300}
          margin={{ top: 20, right: 20, bottom: 30, left: 50 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: { hidden: true },
          }}
          sx={{
            '& .MuiAreaElement-root': {
              fill: 'url(#gradient)',
              fillOpacity: 0.3,
            },
            '& .MuiLineElement-root': {
              strokeWidth: 3,
            },
            '& .MuiMarkElement-root': {
              fill: '#ec4899',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 5,
            },
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </LineChart>
      </div>

      {/* Leyenda de información adicional */}
      <div className="waste-trend-footer">
        <div className="waste-trend-legend">
          <div className="waste-trend-legend-item">
            <div className="waste-trend-legend-color" style={{ backgroundColor: '#ec4899' }}></div>
            <span>Cantidad total desperdiciada (unidades)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteTrendChart;