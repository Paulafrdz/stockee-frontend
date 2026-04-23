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
            saleId: sale.id,
            date: sale.date,
            dishId: line.dishId,
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
                hour: '2-digit',
                minute: '2-digit',
            });
        }
        return new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="st-container">
            <div className="st-table">
                <table aria-label="Registro de ventas">
                    <caption className="sr-only">
                        Tabla de ventas con plato, cantidad, fecha y acciones
                    </caption>


                    {/* Head */}
                    <thead className="st-head">
                        <tr>
                            <th scope="col" className="st-th st-col-icon">Icono</th>
                            <th scope="col" className="st-th st-col-name">Plato</th>
                            <th scope="col" className="st-th st-col-qty">Cantidad</th>
                            <th scope="col" className="st-th st-col-date">Fecha y hora</th>
                            <th scope="col" className="st-th st-col-actions">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="st-body">
                        {filteredRows.length > 0 ? (
                            filteredRows.map((row, idx) => {
                                const iconEntry = DISH_ICONS.find(i => i.id === row.dishIcon);
                                const IconComponent = iconEntry?.Icon ?? null;

                                return (
                                    <tr
                                        key={`${row.saleId}-${row.dishId}-${idx}`}
                                        className="st-row"
                                    >
                                        {/* Icon */}
                                        <td className="st-td st-col-icon">
                                            {IconComponent
                                                ? <IconComponent size={20} strokeWidth={1.5} aria-hidden="true" />
                                                : <span aria-hidden="true">🍽️</span>
                                            }
                                        </td>

                                        {/* Dish name */}
                                        <td className="st-td st-col-name">
                                            {row.dishName}
                                        </td>

                                        {/* Quantity */}
                                        <td className="st-td st-col-qty">
                                            {row.quantity}
                                        </td>

                                        {/* Date */}
                                        <td className="st-td st-col-date">
                                            {formatDate(row.date)}
                                        </td>

                                        {/* Delete */}
                                        <td className="st-td st-col-actions">
                                            <button
                                                className="st-delete-btn"
                                                onClick={() => onDelete && onDelete(row.saleId)}
                                                aria-label={`Eliminar venta de ${row.dishName}`}
                                            >
                                                <Trash2 size={16} aria-hidden="true" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="st-empty">
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
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesTable;