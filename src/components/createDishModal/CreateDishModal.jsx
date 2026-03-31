import { useState } from 'react';
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import { Pizza, Salad, Hamburger, Beef, Fish, Sandwich, Soup, X, CakeSlice, Croissant} from 'lucide-react';
import './CreateDishModal.css';

export const DISH_ICONS = [
    { id: 'pizza', Icon: Pizza},
    { id: 'salad', Icon: Salad},
    { id: 'hamburger', Icon: Hamburger},
    { id: 'beef', Icon: Beef},
    { id: 'fish', Icon: Fish},
    { id: 'sandwich', Icon: Sandwich },
    { id: 'soup', Icon: Soup},
    { id: 'cake', Icon: CakeSlice},
    { id: 'croissant', Icon: Croissant},
    
];


const CreateDishModal = ({ isOpen, onClose, onSubmit, inventoryItems = [] }) => {
    const [formData, setFormData] = useState({
        icon: null,
        name: '',
        description: '',
    });
    const [ingredients, setIngredients] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleIconSelect = (iconId) => {
        setFormData(prev => ({ ...prev, icon: prev.icon === iconId ? null : iconId }));
        if (errors.icon) setErrors(prev => ({ ...prev, icon: '' }));
    };

    //  Ingredient row handlers

    const handleAddIngredient = () => {
        setIngredients(prev => [
            ...prev,
            { id: Date.now(), itemId: '', quantity: '', unit: '' },
        ]);
    };

    const handleRemoveIngredient = (rowId) => {
        setIngredients(prev => prev.filter(ing => ing.id !== rowId));
    };

    const handleIngredientChange = (rowId, field, value) => {
        setIngredients(prev =>
            prev.map(ing => {
                if (ing.id !== rowId) return ing;
                if (field === 'itemId') {
                    const item = inventoryItems.find(i => String(i.id) === value);
                    return { ...ing, itemId: value, unit: item?.unit ?? '' };
                }
                return { ...ing, [field]: value };
            })
        );
    };

    //  Validation

    const validateForm = () => {
        const newErrors = {};

        if (!formData.icon) {
            newErrors.icon = 'Selecciona un icono para el plato';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del plato es requerido';
        }
        if (!formData.ingredients.trim()) {
            newErrors.ingredients = 'Los ingredientes del plato es requerido';
        }

        // Validate each ingredient row that has been partially filled
        const invalidIngredients = ingredients.some(
            ing => (ing.itemId && !ing.quantity) || (!ing.itemId && ing.quantity)
        );
        if (invalidIngredients) {
            newErrors.ingredients = 'Completa o elimina los ingredientes incompletos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //  Submit 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const dishData = {
                icon: formData.icon,
                name: formData.name.trim(),
                description: formData.description.trim(),
                ingredients: ingredients
                    .filter(ing => ing.itemId && ing.quantity)
                    .map(ing => ({
                        inventoryItemId: parseInt(ing.itemId, 10),
                        quantity: parseFloat(ing.quantity),
                        unit: ing.unit,
                    })),
            };

            console.log('🔍 CreateDishModal - Enviando data:', dishData);

            await onSubmit(dishData);

        } catch (error) {
            console.error('❌ Error en CreateDishModal:', error);
            let errorMessage = 'Error al crear el plato';

            if (error.response) {
                errorMessage = error.response.data?.message
                    || error.response.data?.error
                    || `Error ${error.response.status}: ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = 'No se pudo conectar al servidor';
            } else {
                errorMessage = error.message || errorMessage;
            }

            setErrors({ submit: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    // \ Close / reset 

    const handleClose = () => {
        if (isLoading) return;
        setFormData({ icon: null, name: '', description: '' });
        setIngredients([]);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="modal-header">
                    <h2 className="modal-title">Crear plato</h2>
                    <button
                        className="modal-close-button"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="modal-form">

                    {/* Icon picker */}
                    <div className="form-field">
                        <label className="input-label required">Icono</label>
                        <div className="cdm-icon-chips">
                            {DISH_ICONS.map(icon => {
                                const IconComponent = icon.Icon;
                                return (
                                    <button
                                        key={icon.id}
                                        type="button"
                                        className={`cdm-icon-chip${formData.icon === icon.id ? ' cdm-icon-chip--selected' : ''}`}
                                        onClick={() => handleIconSelect(icon.id)}
                                        disabled={isLoading}
                                        aria-pressed={formData.icon === icon.id}
                                    >
                                        <IconComponent size={24} />
                                        {icon.label}
                                    </button>
                                );
                            })}

                        </div>
                        {errors.icon && (
                            <span className="input-error">{errors.icon}</span>
                        )}
                    </div>

                    {/* Dish name */}
                    <div className="form-field">
                        <Input
                            type="text"
                            label="Nombre del plato"
                            placeholder="Ej. Ensalada César"
                            value={formData.name}
                            onChange={handleChange('name')}
                            error={errors.name}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-field">
                        <label className="input-label">
                            Descripción <span className="cdm-optional">(opcional)</span>
                        </label>
                        <textarea
                            className="cdm-textarea"
                            placeholder="Ejemplo: Ensalada fresca con pollo a la plancha y aderezo César..."
                            value={formData.description}
                            onChange={handleChange('description')}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    {/* Ingredients */}
                    <div className="form-field">
                        <div className="cdm-section-header">
                            <label className="input-label required">
                                Ingredientes y receta
                            </label>

                            <button
                                type="button"
                                className="cdm-add-ingredient-btn"
                                onClick={handleAddIngredient}
                                required
                                disabled={isLoading}
                            >
                                + Añadir
                            </button>
                        </div>

                        {ingredients.length === 0 && (
                            <p className="cdm-empty-msg">
                                Añade los ingredientes que componen este plato.
                            </p>
                        )}

                        <div className="cdm-ingredients-list">
                            {ingredients.map(ing => (
                                <div key={ing.id} className="cdm-ingredient-row">

                                    {/* Ingredient selector */}
                                    <div className="form-field">
                                        <label className="cdm-row-label">Ingrediente</label>
                                        <select
                                            className="select-field"
                                            value={ing.itemId}
                                            onChange={e => handleIngredientChange(ing.id, 'itemId', e.target.value)}
                                            disabled={isLoading}
                                        >
                                            <option value="">Selecciona un producto...</option>
                                            {inventoryItems.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name} — {item.currentStock} {item.unit} disponibles
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Quantity + unit side by side */}
                                    <div className="form-row">
                                        <div className="form-field">
                                            <Input
                                                type="number"
                                                label="Cantidad"
                                                placeholder="0"
                                                value={ing.quantity}
                                                onChange={e => handleIngredientChange(ing.id, 'quantity', e.target.value)}
                                                disabled={isLoading}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label className="cdm-row-label">Unidad</label>
                                            <div className="cdm-unit-display">
                                                {ing.unit || '—'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove row */}
                                    <button
                                        type="button"
                                        className="cdm-remove-btn"
                                        onClick={() => handleRemoveIngredient(ing.id)}
                                        disabled={isLoading}
                                        aria-label="Eliminar ingrediente"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {errors.ingredients && (
                            <span className="input-error">{errors.ingredients}</span>
                        )}
                    </div>

                    {/* Submit error */}
                    {errors.submit && (
                        <div className="form-error">{errors.submit}</div>
                    )}

                    {/* Actions */}
                    <div className="modal-actions">
                        <Button
                            type="button"
                            variant="outline"
                            size="medium"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="medium"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Guardar plato
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateDishModal;