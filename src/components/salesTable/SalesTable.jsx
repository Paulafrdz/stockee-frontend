import { Trash2 } from 'lucide-react';
import { DISH_ICONS } from '../createDishModal/CreateDishModal';
import './SalesTable.css';

const SalesTable = ({
    sales = [],
    onDelete,
    searchTerm = '',
    onSearchChange,
    activeTab,
    onTabChange,
}) => {

    const rows = sales.flatMap(sale =>
        sale.lines.map(line => ({
            saleId:   sale.id,
            date:     sale.date,
            dishId:   line.dishId,
            dishName: line.dishName,
            dishIcon: line.dishIcon,
            quantity: line.quantity,
        }))
    );

    const today = new Date().toDateString();
    const filteredRows = rows.filter(row => {
        const rowDate = new Date(row.date).toDateString();
        const matchesTab = activeTab === 'today'
            ? rowDate === today
            : rowDate !== today;
        const matchesSearch = row.dishName.toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const formatDate = (dateString) => {
        if (activeTab === 'today') {
            return new Date(dateString).toLocaleString('es-ES', {
                hour:   '2-digit',
                minute: '2-digit',
            });
        }
        return new Date(dateString).toLocaleString('es-ES', {
            day:    '2-digit',
            month:  '2-digit',
            year:   'numeric',
            hour:   '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="sale-table-container">
            <div className="sale-table">
                <div className="table-content">

                    {/* Head */}
                    <div className="table-head">
                        <div className="td st-icon">Icono</div>
                        <div className="td st-dish-name">Plato</div>
                        <div className="td st-quantity">Cantidad</div>
                        <div className="td st-date">Fecha y hora</div>
                        <div className="th"></div>
                    </div>

                    {/* Body */}
                    <div className="table-body">
                        {filteredRows.length > 0 ? (
                            filteredRows.map((row, idx) => {
                                const iconEntry = DISH_ICONS.find(i => i.id === row.dishIcon);
                                const IconComponent = iconEntry?.Icon ?? null;

                                return (
                                    <div key={`${row.saleId}-${row.dishId}-${idx}`} className="table-row">

                                        {/* Icon */}
                                        <div className="td">
                                            {IconComponent
                                                ? <IconComponent size={20} strokeWidth={1.5} />
                                                : <span>🍽️</span>
                                            }
                                        </div>

                                        {/* Dish name */}
                                        <div className="td">{row.dishName}</div>

                                        {/* Quantity */}
                                        <div className="td">{row.quantity}</div>

                                        {/* Date */}
                                        <div className="td st-date">
                                            {formatDate(row.date)}
                                        </div>

                                        {/* Delete */}
                                        <div className="td actions">
                                            <button
                                                className="action-btn delete-btn-sale"
                                                onClick={() => onDelete && onDelete(row.saleId)}
                                                title="Eliminar venta"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="table-empty">
                                <h3>
                                    {activeTab === 'today'
                                        ? 'No hay ventas hoy'
                                        : 'No hay ventas en el historial'}
                                </h3>
                                <p>
                                    {activeTab === 'today'
                                        ? 'Pulsa + para registrar la primera venta del día'
                                        : 'Las ventas de días anteriores aparecerán aquí'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesTable;