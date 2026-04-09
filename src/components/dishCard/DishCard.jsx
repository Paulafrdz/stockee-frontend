import { Trash2 } from 'lucide-react';
import { DISH_ICONS } from '../createDishModal/CreateDishModal';
import './DishCard.css';


export const getDishStockStatus = (dishIngredients = [], inventoryItems = []) => {
    let worst = 'ok';

    for (const ing of dishIngredients) {
        const item = inventoryItems.find(i => Number(i.id) === Number(ing.ingredientId));
        if (!item) continue;

        const { currentStock, minimumStock } = item;

        if (currentStock <= minimumStock * 0.5) {
            return 'critical'; // No need to check further, already worst
        }
        if (currentStock <= minimumStock * 1.5) {
            worst = 'low';
        }
    }
    console.log('🔍 ingredientes del plato:', dishIngredients);
    console.log('🔍 inventoryItems:', inventoryItems.slice(0, 2));
    return worst;
};

const STATUS_CONFIG = {
    ok: null, // No banner
    low: {
        label: 'Bajo en stock',
        className: 'dc-status--low',
    },
    critical: {
        label: 'Sin stock',
        className: 'dc-status--critical',
    },
};

/**
 * DishCard
 *
 * Props:
 *  - dish           {Object}    { id, icon, name, description, ingredients }
 *  - inventoryItems {Array}     [{ id, name, currentStock, minimumStock, unit }]
 *  - onViewDetails  {function}  Called with dish when "Ver detalles" is clicked
 *  - onDelete       {function}  Called with dish.id when delete is clicked
 */
const DishCard = ({ dish, inventoryItems = [], onViewDetails, onDelete }) => {
    const status = getDishStockStatus(dish.ingredients, inventoryItems);
    const statusConfig = STATUS_CONFIG[status];

    // Resolve lucide icon from DISH_ICONS list
    const iconEntry = DISH_ICONS.find(i => i.id === dish.icon);
    const IconComponent = iconEntry?.Icon ?? null;

    return (
        <div className={`dc-card${statusConfig ? ` dc-card--${status}` : ''}`}>

            {/* Stock status banner — only rendered when there's an issue */}
            {statusConfig && (
                <div className={`dc-status ${statusConfig.className}`}>
                    <span className="dc-status-dot" />
                    {statusConfig.label}
                </div>
            )}

            {/* Delete button */}
            {onDelete && (
                <button
                    className="dc-delete-btn"
                    onClick={() => onDelete(dish.id)}
                    aria-label="Eliminar plato"
                    title="Eliminar plato"
                >
                    <Trash2 size={14} />
                </button>
            )}

            {/* Icon area */}
            <div className="dc-icon-area">
                {IconComponent
                    ? <IconComponent size={48} strokeWidth={1.5} />
                    : <span className="dc-icon-fallback">🍽️</span>
                }
            </div>

            {/* Info */}
            <div className="dc-info">
                <h3 className="dc-name">{dish.name}</h3>
                {dish.description && (
                    <p className="dc-description">{dish.description}</p>
                )}
            </div>

            {/* Footer */}
            <div className="dc-footer">
                <button
                    className="dc-details-btn"
                    onClick={() => onViewDetails?.(dish)}
                >
                    Ver detalles
                </button>
            </div>

        </div>
    );
};

export default DishCard;