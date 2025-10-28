import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import './WasteGauge.css';

const WasteGauge = ({ value = 0, title = "Desperdicio Total" }) => {
  const getColor = () => {
    if (value <= 5) return 'var(--primary-500)'; 
    if (value <= 15) return 'var(--secondary-500)'; 
    return 'var(--terciary-500)'; 
  };

  return (
    <div className="waste-gauge-container">
      <div className="waste-gauge-header">
        <h3 className="waste-gauge-title">{title}</h3>
      </div>

      <div className="waste-gauge-wrapper">
        <Gauge
          value={value}
          startAngle={0}      
          endAngle={360}      
          width={200}
          height={200}
          innerRadius="80%"   
          outerRadius="100%"
          cornerRadius="50%"
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

export default WasteGauge;