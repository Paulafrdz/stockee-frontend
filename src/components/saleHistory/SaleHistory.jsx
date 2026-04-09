import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { DISH_ICONS } from '../createDishModal/CreateDishModal';
import StockFilters from '../stockFilters/StockFilters';

import './SaleHistory.css';


const SaleHistory = ({ sales = [] }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [dateRange, setDateRange] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter out today's sales — history = past days only
    const today = new Date().toDateString();

    const filteredSales = sales
        .filter(sale => new Date(sale.date).toDateString() !== today)
        .filter(sale => {
            // Date range filter
            if (dateRange === 'all') return true;
            const diff = Math.floor(
                (new Date() - new Date(sale.date)) / (1000 * 60 * 60 * 24)
            );
            if (dateRange === 'week') return diff <= 7;
            if (dateRange === 'month') return diff <= 30;
            if (dateRange === 'quarter') return diff <= 90;
            return true;
        })
        .filter(sale =>
            // Search by dish name inside lines
            searchTerm === '' ||
            sale.lines.some(line =>
                line.dishName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        // Most recent first
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const totalDishes = (sale) =>
        sale.lines.reduce((acc, line) => acc + line.quantity, 0);

    const toggleExpand = (id) =>
        setExpandedId(prev => prev === id ? null : id);

    return (
        <div className="sh-container">

            {/* ── Controls ── */}
            <div className="sh-controls">
                <select
                    className="select-field"
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                >
                    <option value="all">Todas las fechas</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                    <option value="quarter">Último trimestre</option>
                </select>
            </div>

            {/* ── Empty state ── */}
            {filteredSales.length === 0 && (
                <div className="sh-empty">
                    <Calendar size={32} strokeWidth={1.5} />
                    <p className="sh-empty-title">No hay ventas en el historial</p>
                    <p className="sh-empty-sub">
                        {searchTerm
                            ? 'Prueba con otro nombre de plato'
                            : 'Las ventas de días anteriores aparecerán aquí'}
                    </p>
                </div>
            )}

            {/* ── Sale cards ── */}
            <div className="sh-list">
                {filteredSales.map(sale => {
                    const isExpanded = expandedId === sale.id;

                    return (
                        <div key={sale.id} className="sh-card">

                            {/* Card header — always visible */}
                            <button
                                className="sh-card-header"
                                onClick={() => toggleExpand(sale.id)}
                                aria-expanded={isExpanded}
                            >
                                <div className="sh-card-left">
                                    <div className="sh-card-date">
                                        <Calendar size={14} />
                                        {formatDate(sale.date)}
                                    </div>
                                    <div className="sh-card-meta">
                                        <span className="sh-badge">
                                            {sale.lines.length} {sale.lines.length === 1 ? 'plato' : 'platos'}
                                        </span>
                                        <span className="sh-badge">
                                            {totalDishes(sale)} uds. vendidas
                                        </span>
                                        <span className="sh-time">
                                            {formatTime(sale.date)}
                                        </span>
                                    </div>
                                </div>

                                <div className="sh-chevron">
                                    {isExpanded
                                        ? <ChevronUp size={18} />
                                        : <ChevronDown size={18} />
                                    }
                                </div>
                            </button>

                            {/* Expandable lines table */}
                            {isExpanded && (
                                <div className="sh-lines">
                                    <div className="sh-lines-head">
                                        <div className="sh-th">Icono</div>
                                        <div className="sh-th">Plato</div>
                                        <div className="sh-th sh-th--center">Cantidad</div>
                                    </div>
                                    {sale.lines.map((line, idx) => {
                                        const iconEntry = DISH_ICONS.find(i => i.id === line.dishIcon);
                                        const IconComponent = iconEntry?.Icon ?? null;

                                        return (
                                            <div key={`${sale.id}-${line.dishId}-${idx}`} className="sh-line-row">
                                                <div className="sh-td sh-td--icon">
                                                    {IconComponent
                                                        ? <IconComponent size={18} strokeWidth={1.5} />
                                                        : <span>🍽️</span>
                                                    }
                                                </div>
                                                <div className="sh-td">{line.dishName}</div>
                                                <div className="sh-td sh-td--center">{line.quantity}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SaleHistory;