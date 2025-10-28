import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import './EfficiencyGauge.css';

const EfficiencyGauge = ({ value = 0, title = "Eficiencia Total" }) => {
  const getColor = () => {
    if (value >= 90) return 'var(--primary-500)'; // Verde
    if (value >= 70) return 'var(--secondary-500)'; // Naranja
    return 'var(--terciary-500)'; // Rosa
  };

  return (
    <div className="efficiency-gauge-container">
      <div className="efficiency-gauge-header">
        <h3 className="efficiency-gauge-title">{title}</h3>
        <p className="efficiency-gauge-subtitle">Porcentaje general</p>
      </div>

      <div className="efficiency-gauge-wrapper">
        <Gauge
          value={value}
          startAngle={0}
          endAngle={360}
          width={200}
          height={200}
          innerRadius="80%"
          outerRadius="100%"
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 32,
              fontWeight: 700,
              fill: '#0D0943',
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: getColor(),
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: '#F2F2F2',
            },
          }}
          text={({ value }) => `${value}%`}
        />
      </div>
    </div>
  );
};

export default EfficiencyGauge;