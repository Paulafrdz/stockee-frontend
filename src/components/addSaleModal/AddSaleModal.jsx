import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DISH_ICONS } from '../createDishModal/CreateDishModal';
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import '../modal/Modal.css';
import './AddSaleModal.css';


const AddSaleModal = ({ isOpen, onClose, onSubmit, dishes = [] }) => {
    const [formData, setFormData] = useState({
        dishId:   '',
        quantity: '',
    });
    const [errors, setErrors]     = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setFormData({ dishId: '', quantity: '' });
            setErrors({});
        }
    }, [isOpen]);

    const selectedDish = dishes.find(d => String(d.id) === formData.dishId) ?? null;
    const iconEntry    = DISH_ICONS.find(i => i.id === selectedDish?.icon);
    const IconComponent = iconEntry?.Icon ?? null;

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.dishId)  newErrors.dishId   = 'Selecciona un plato';
        if (!formData.quantity) {
            newErrors.quantity = 'La cantidad es requerida';
        } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
            newErrors.quantity = 'Debe ser un número mayor que 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await onSubmit({
                dishId:   parseInt(formData.dishId, 10),
                dishName: selectedDish.name,
                dishIcon: selectedDish.icon,
                quantity: parseFloat(formData.quantity),
            });
        } catch (error) {
            console.error('❌ Error en AddSaleModal:', error);
            let errorMessage = 'Error al registrar la venta';
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

    const handleClose = () => {
        if (isLoading) return;
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="modal-header">
                    <h2 className="modal-title">Añadir plato a la venta</h2>
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

                    {/* Dish selector */}
                    <div className="form-field">
                        <label className="input-label required">Plato</label>
                        <select
                            className="select-field"
                            value={formData.dishId}
                            onChange={handleChange('dishId')}
                            disabled={isLoading}
                        >
                            <option value="">Selecciona un plato...</option>
                            {dishes.map(dish => (
                                <option key={dish.id} value={dish.id}>
                                    {dish.name}
                                </option>
                            ))}
                        </select>
                        {errors.dishId && (
                            <span className="input-error">{errors.dishId}</span>
                        )}
                    </div>

                    {/* Selected dish preview */}
                    {selectedDish && (
                        <div className="asm-dish-preview">
                            <div className="asm-dish-icon">
                                {IconComponent
                                    ? <IconComponent size={28} strokeWidth={1.5} />
                                    : <span>🍽️</span>
                                }
                            </div>
                            <div className="asm-dish-info">
                                <span className="asm-dish-name">{selectedDish.name}</span>
                                {selectedDish.description && (
                                    <span className="asm-dish-desc">{selectedDish.description}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="form-field">
                        <Input
                            type="number"
                            label="Cantidad"
                            placeholder="1"
                            value={formData.quantity}
                            onChange={handleChange('quantity')}
                            error={errors.quantity}
                            required
                            disabled={isLoading}
                            min="1"
                            step="1"
                        />
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
                            Añadir a la venta
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddSaleModal;