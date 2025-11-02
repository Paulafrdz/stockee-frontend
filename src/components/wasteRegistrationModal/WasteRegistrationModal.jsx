import React, { useState, useEffect } from 'react';
import { registerWaste } from '../../services/wasteService';
import './WasteRegistrationModal.css';

const WasteRegistrationModal = ({ isOpen, onClose, onWasteRegistered, ingredients = [] }) => {
    const [formData, setFormData] = useState({
        product: '',        
        quantity: '',       
        unit: 'kg',
        reason: '',         
        details: ''        
    });

    const [selectedReason, setSelectedReason] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && ingredients.length > 0) {
            console.log('🔍 INGREDIENTS RECEIVED:', ingredients);
        }
    }, [isOpen, ingredients]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason);
        setFormData(prev => ({
            ...prev,
            reason: reason
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedReason) {
            alert('Please select a waste reason');
            return;
        }

        if (!formData.product || !formData.quantity) {
            alert('Please complete all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            const selectedIngredient = ingredients.find(
                ing => ing.id === parseInt(formData.product)
            );

            if (!selectedIngredient) {
                alert('Error: Product not found');
                return;
            }

            const wasteData = {
                ingredientId: selectedIngredient.id,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                reason: formData.reason,
                details: formData.details
            };

            console.log('📤 Sending waste registration:', wasteData);

            const result = await registerWaste(wasteData);

            console.log('✅ Waste registered:', result);

            if (onWasteRegistered) {
                onWasteRegistered({
                    ...wasteData,
                    id: result.id,
                    ingredientName: selectedIngredient.name,
                    timestamp: result.timestamp
                });
            }

            handleClose();

        } catch (error) {
            console.error('❌ Error registering waste:', error);
            alert('Error registering waste. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            product: '',
            quantity: '',
            unit: 'kg',
            reason: '',
            details: ''
        });
        setSelectedReason(null);
        setIsSubmitting(false);
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const reasons = [
        { value: 'expired', label: 'Caducado', emoji: '📅' },
        { value: 'burned', label: 'Quemado', emoji: '🔥' },
        { value: 'wrong-ingredient', label: 'Ingrediente incorrecto', emoji: '❌' },
         { value: 'over-preparation', label: 'Preparación excesiva', emoji: '🍽️' },
        { value: 'breakage', label: 'Roto', emoji: '💥' },
        { value: 'natural-waste', label: 'Merma', emoji: '💧' },
        { value: 'other', label: 'Otro', emoji: '💠' }
    ];

    const units = [
        { value: 'kg', label: 'kg' },
        { value: 'g', label: 'g' },
        { value: 'l', label: 'l' },
        { value: 'ml', label: 'ml' },
        { value: 'units', label: 'units' }
    ];

    return (
        <div className="waste-modal-overlay" onClick={handleOverlayClick}>
            <div className="waste-modal-container">
                <div className="waste-modal-header">
                    <h2 className="waste-modal-title">Registrar desperdicio</h2>
                    <button
                        className="waste-modal-close-btn"
                        onClick={handleClose}
                        aria-label="Close"
                        type="button"
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                <div className="waste-modal-body">
                    <form id="wasteForm" onSubmit={handleSubmit}>
                        {/* Product/Ingredient */}
                        <div className="waste-form-group">
                            <label className="waste-form-label">
                                Producto / Ingrediente <span className="waste-form-required">*</span>
                            </label>
                            <select
                                className="waste-form-control waste-form-select"
                                name="product"
                                value={formData.product}
                                onChange={handleInputChange}
                                required
                                disabled={ingredients.length === 0 || isSubmitting}
                            >
                                <option value="">
                                    {ingredients.length === 0
                                        ? 'No ingredients available'
                                        : 'Selecciona un producto..'}
                                </option>
                                {ingredients.map(ingredient => (
                                    <option
                                        key={ingredient.id}
                                        value={ingredient.id}
                                    >
                                        {ingredient.name}
                                        {ingredient.currentStock !== undefined && 
                                            ` (Stock: ${ingredient.currentStock} ${ingredient.unit})`
                                        }
                                    </option>
                                ))}
                            </select>
                            {ingredients.length === 0 && (
                                <div className="waste-form-error">
                                   No hay ingredientes en stock. Añadelos primero.
                                </div>
                            )}
                        </div>

                        {/* Quantity and Unit */}
                        <div className="waste-form-group">
                            <label className="waste-form-label">
                                Cantidad <span className="waste-form-required">*</span>
                            </label>
                            <div className="waste-input-group">
                                <input
                                    type="number"
                                    className="waste-form-control waste-form-input"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="2.5"
                                    step="0.01"
                                    min="0"
                                    required
                                    disabled={isSubmitting}
                                />
                                <select
                                    className="waste-form-control waste-form-select waste-unit-select"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSubmitting}
                                >
                                    {units.map(unit => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Waste Reason */}
                        <div className="waste-form-group">
                            <label className="waste-form-label">
                                Que le pasó al producto? <span className="waste-form-required">*</span>
                            </label>
                            <div className="waste-chip-group">
                                {reasons.map(reason => (
                                    <button
                                        key={reason.value}
                                        type="button"
                                        className={`waste-chip ${selectedReason === reason.value ? 'waste-chip-active' : ''}`}
                                        onClick={() => handleReasonSelect(reason.value)}
                                        disabled={isSubmitting}
                                    >
                                        <span className="waste-chip-emoji">{reason.emoji}</span>
                                        {reason.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="waste-form-group">
                            <label className="waste-form-label">
                                Detalles adicionales (opcional)
                            </label>
                            <textarea
                                className="waste-form-control waste-form-textarea"
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                placeholder="Ejemplo: Se quemo durante el servicio de comidas, la temperatura estaba muy alta"
                                disabled={isSubmitting}
                                rows="3"
                            />
                        </div>
                    </form>
                </div>

                <div className="waste-modal-footer">
                    <button
                        type="button"
                        className="waste-btn waste-btn-secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="wasteForm"
                        className="waste-btn waste-btn-primary"
                        disabled={isSubmitting || ingredients.length === 0 || !selectedReason}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="waste-btn-loading">⏳</span>
                                Registering...
                            </>
                        ) : (
                            <>
                                <span className="waste-btn-icon">✓</span>
                                Añadir despercidio
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WasteRegistrationModal;