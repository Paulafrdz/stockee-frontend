import { X } from 'lucide-react';
import { DISH_ICONS } from '../createDishModal/CreateDishModal';
import Button from '../button/Button';
import './DishDetailModal.css';
import '../modal/Modal.css'


const getStockStatus = (currentStock, minimumStock) => {
    if (currentStock <= minimumStock * 0.5) return 'critical';
    if (currentStock <= minimumStock * 1.5) return 'low';
    return 'ok';
};

const STATUS_LABEL = {
    ok: 'Ok',
    low: 'Low',
    critical: 'Crítico',
};


const DishDetailModal = ({ isOpen, onClose, onEdit, dish, inventoryItems = [] }) => {
    if (!isOpen || !dish) return null;

    const iconEntry = DISH_ICONS.find(i => i.id === dish.icon);
    const IconComponent = iconEntry?.Icon ?? null;

    // Cross inventory data into each ingredient row
    const ingredientsWithStatus = (dish.ingredients ?? []).map(ing => {
        const item = inventoryItems.find(
            i => Number(i.id) === Number(ing.ingredientId)
        );
        const status = item
            ? getStockStatus(item.currentStock, item.minimumStock)
            : 'ok';
        return {
            ...ing,
            currentStock: item?.currentStock ?? null,
            minimumStock: item?.minimumStock ?? null,
            status,
            statusLabel: STATUS_LABEL[status],
        };
    });

    const handleClose = () => onClose();
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) handleClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="modal-header">
                    <div className="ddm-header-title">
                        {IconComponent && (
                            <div className="ddm-header-icon">
                                <IconComponent size={28} strokeWidth={1.5} />
                            </div>
                        )}
                        <h2 className="modal-title">{dish.name}</h2>
                    </div>
                    <button className="modal-close-button" onClick={handleClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="modal-form">
                    <div className="ddm-body">

                        {/* Description */}
                        {dish.description && (
                            <div className="ddm-section">
                                <h3 className="ddm-section-title">Descripción</h3>
                                <p className="ddm-description">{dish.description}</p>
                            </div>
                        )}

                        {/* Ingredients table */}
                        <div className="ddm-section">
                            <h3 className="ddm-section-title">Ingredientes</h3>

                            {ingredientsWithStatus.length === 0 ? (
                                <p className="ddm-empty">Este plato no tiene ingredientes registrados.</p>
                            ) : (
                                <table className="ddm-table" aria-label="Ingredientes del plato">
                                    {/* Head */}
                                    <thead className="ddm-table-head">
                                        <tr>
                                            <th scope="col" className="ddm-th">Ingrediente</th>
                                            <th scope="col" className="ddm-th ddm-th--center">Cantidad</th>
                                            <th scope="col" className="ddm-th ddm-th--center">Unidad</th>
                                            <th scope="col" className="ddm-th ddm-th--center">Estado</th>
                                        </tr>
                                    </thead>

                                    {/* Rows */}
                                    <tbody className="ddm-table-body">
                                        {ingredientsWithStatus.map((ing, idx) => (
                                            <tr
                                                key={ing.ingredientId ?? idx}
                                                className={`ddm-table-row ddm-row--${ing.status}`}
                                            >
                                                <td className="ddm-td ddm-td--name">
                                                    {ing.ingredientName}
                                                </td>
                                                <td className="ddm-td ddm-td--center">
                                                    {ing.quantity}
                                                </td>
                                                <td className="ddm-td ddm-td--center">
                                                    {ing.unit}
                                                </td>
                                                <td className="ddm-td ddm-td--center">
                                                    <span className={`ddm-badge ddm-badge--${ing.status}`}>
                                                        {ing.statusLabel}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="modal-actions">
                        <Button
                            type="button"
                            variant="outline"
                            size="medium"
                            onClick={handleClose}
                        >
                            Cerrar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            size="medium"
                            onClick={() => onEdit(dish)}
                        >
                            Editar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishDetailModal;