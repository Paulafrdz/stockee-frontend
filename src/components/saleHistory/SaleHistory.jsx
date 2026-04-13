import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { DISH_ICONS } from '../createDishModal/CreateDishModal';
import InputSelect from '../inputSelect/inputSelect';
import './SaleHistory.css';


const SaleHistory = ({ sales = [] }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [dateRange, setDateRange] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const today = new Date().toDateString();

    // Filter out today, apply date range and search
    const filteredSales = sales
        .filter(sale => new Date(sale.date).toDateString() !== today)
        .filter(sale => {
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
            searchTerm === '' ||
            sale.lines.some(line =>
                line.dishName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by day
    const groupedByDay = filteredSales.reduce((acc, sale) => {
        const day = new Date(sale.date).toDateString();
        if (!acc[day]) acc[day] = [];
        acc[day].push(sale);
        return acc;
    }, {});

    const groupedDays = Object.entries(groupedByDay)
        .sort(([a], [b]) => new Date(b) - new Date(a));

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

    const toggleExpand = (id) =>
        setExpandedId(prev => prev === id ? null : id);

    return (
        <div className="sh-container">

            {/* ── Controls ── */}
            <div className="sh-select-wrapper">

                <InputSelect
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                >
                    <option value="all">Todas las fechas</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                    <option value="quarter">Último trimestre</option>
                </InputSelect>
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

            {/* ── Sale cards grouped by day ── */}
            <div className="sh-list">
                {groupedDays.map(([day, daySales]) => {
                    const isExpanded = expandedId === day;
                    const allLines = daySales.flatMap(sale =>
                        sale.lines.map(line => ({
                            ...line,
                            time: sale.date,
                            saleId: sale.id,
                        }))
                    );
                    const totalQty = allLines.reduce((acc, l) => acc + l.quantity, 0);

                    return (
                        <div key={day} className="sh-card">

                            {/* Card header */}
                            <button
                                className="sh-card-header"
                                onClick={() => toggleExpand(day)}
                                aria-expanded={isExpanded}
                            >
                                <div className="sh-card-left">
                                    <div className="sh-card-date">
                                        <Calendar size={14} />
                                        {formatDate(daySales[0].date)}
                                    </div>
                                    <div className="sh-card-meta">
                                        <span className="sh-badge">
                                            {allLines.length} {allLines.length === 1 ? 'plato' : 'platos'}
                                        </span>
                                        <span className="sh-badge">
                                            {totalQty} uds. vendidas
                                        </span>
                                        <span className="sh-badge">
                                            {daySales.length} {daySales.length === 1 ? 'venta' : 'ventas'}
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

                            {/* Expandable lines */}
                            {isExpanded && (
                                <div className="sh-lines">
                                    <div className="sh-lines-head">
                                        <div className="sh-th">Icono</div>
                                        <div className="sh-th">Plato</div>
                                        <div className="sh-th sh-th--center">Cantidad</div>
                                        <div className="sh-th sh-th--center">Hora</div>
                                    </div>
                                    {allLines.map((line, idx) => {
                                        const iconEntry = DISH_ICONS.find(i => i.id === line.dishIcon);
                                        const IconComponent = iconEntry?.Icon ?? null;

                                        return (
                                            <div
                                                key={`${line.saleId}-${line.dishId}-${idx}`}
                                                className="sh-line-row"
                                            >
                                                <div className="sh-td sh-td--icon">
                                                    {IconComponent
                                                        ? <IconComponent size={18} strokeWidth={1.5} />
                                                        : <span>🍽️</span>
                                                    }
                                                </div>
                                                <div className="sh-td">{line.dishName}</div>
                                                <div className="sh-td sh-td--center">{line.quantity}</div>
                                                <div className="sh-td sh-td--center">
                                                    {formatTime(line.time)}
                                                </div>
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