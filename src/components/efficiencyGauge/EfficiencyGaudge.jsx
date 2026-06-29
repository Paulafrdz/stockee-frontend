import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import './EfficiencyGauge.css';

// Reads a CSS variable from the current theme
const getCSSVar = (variable) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

const EfficiencyGauge = ({ value = 0, title = "Eficiencia Total" }) => {
    const getColor = () => {
        if (value >= 90) return getCSSVar('--primary-500');
        if (value >= 70) return getCSSVar('--secondary-500');
        return getCSSVar('--terciary-500');
    };

    // Re-render when data-theme changes
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => {
        const observer = new MutationObserver(() => forceUpdate());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="efficiency-gauge-container">
            <div className="efficiency-gauge-header">
                <h3 className="efficiency-gauge-title">{title}</h3>
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
                    cornerRadius="50%"
                    sx={{
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 32,
                            fontWeight: 700,
                            fill: getCSSVar('--font-color'),
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: getColor(),
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: getCSSVar('--neutral-500'),
                        },
                    }}
                    text={({ value }) => `${value}%`}
                />
            </div>
        </div>
    );
};

export default EfficiencyGauge;