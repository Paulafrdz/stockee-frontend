// WasteRegistrationModal.jsx
import React, { useState, useEffect } from 'react';
import './WasteRegistrationModal.css';

const WasteRegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    unidad: 'kg',
    razon: '',
    detalles: ''
  });

  const [selectedReason, setSelectedReason] = useState(null);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
      razon: reason
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado una razón
    if (!selectedReason) {
      alert('Por favor, selecciona una razón del desperdicio');
      return;
    }

    // Aquí harías la llamada a tu API
    console.log('Formulario enviado:', formData);
    
    // Callback para manejar el envío del formulario
    // onSubmit(formData);
    
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      producto: '',
      cantidad: '',
      unidad: 'kg',
      razon: '',
      detalles: ''
    });
    setSelectedReason(null);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const ingredients = [
    { value: 'tomates', label: 'Tomates' },
    { value: 'mozzarella', label: 'Mozzarella' },
    { value: 'pasta', label: 'Pasta' },
    { value: 'pollo', label: 'Pollo' },
    { value: 'lechuga', label: 'Lechuga' },
    { value: 'pan', label: 'Pan' },
    { value: 'pizza-margherita', label: 'Pizza Margherita' },
    { value: 'pizza-bbq', label: 'Pizza BBQ' },
    { value: 'pasta-carbonara', label: 'Pasta Carbonara' }
  ];

  const reasons = [
    { value: 'caducidad', label: 'Caducidad', emoji: '🔥' },
    { value: 'quemado', label: 'Error - Quemado', emoji: '🔥' },
    { value: 'ingrediente-incorrecto', label: 'Error - Ingrediente incorrecto', emoji: '❌' },
    { value: 'rotura', label: 'Rotura/Caída', emoji: '🔧' },
    { value: 'merma', label: 'Merma Natural', emoji: '💧' },
    { value: 'otro', label: 'Otro', emoji: '💠' }
  ];

  const units = [
    { value: 'kg', label: 'kg' },
    { value: 'g', label: 'g' },
    { value: 'l', label: 'l' },
    { value: 'ml', label: 'ml' },
    { value: 'unidades', label: 'unidades' }
  ];

  return (
    <div 
      className="waste-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="waste-modal-container">
        {/* Header */}
        <div className="waste-modal-header">
          <h2 className="waste-modal-title">
            <span className="waste-modal-title-icon">⚠️</span>
            Registrar Desperdicio
          </h2>
          <button 
            className="waste-modal-close-btn" 
            onClick={handleClose}
            aria-label="Cerrar"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="waste-modal-body">
          <form id="wasteForm" onSubmit={handleSubmit}>
            {/* Producto/Ingrediente */}
            <div className="waste-form-group">
              <label className="waste-form-label">
                Producto / Ingrediente <span className="waste-form-required">*</span>
              </label>
              <select 
                className="waste-form-control waste-form-select" 
                name="producto"
                value={formData.producto}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un producto...</option>
                {ingredients.map(ingredient => (
                  <option key={ingredient.value} value={ingredient.value}>
                    {ingredient.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cantidad y Unidad */}
            <div className="waste-form-group">
              <label className="waste-form-label">
                Cantidad <span className="waste-form-required">*</span>
              </label>
              <div className="waste-input-group">
                <input 
                  type="number" 
                  className="waste-form-control waste-form-input" 
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  placeholder="2.5" 
                  step="0.01" 
                  min="0" 
                  required
                />
                <select 
                  className="waste-form-control waste-form-select waste-unit-select" 
                  name="unidad"
                  value={formData.unidad}
                  onChange={handleInputChange}
                  required
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Razón del Desperdicio */}
            <div className="waste-form-group">
              <label className="waste-form-label">
                ¿Qué pasó con el producto? <span className="waste-form-required">*</span>
              </label>
              <div className="waste-chip-group">
                {reasons.map(reason => (
                  <button
                    key={reason.value}
                    type="button"
                    className={`waste-chip ${selectedReason === reason.value ? 'waste-chip-active' : ''}`}
                    onClick={() => handleReasonSelect(reason.value)}
                  >
                    <span className="waste-chip-emoji">{reason.emoji}</span>
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Detalles adicionales (opcional) */}
            <div className="waste-form-group">
              <label className="waste-form-label">
                Detalles adicionales (opcional)
              </label>
              <textarea 
                className="waste-form-control waste-form-textarea" 
                name="detalles"
                value={formData.detalles}
                onChange={handleInputChange}
                placeholder="Ej: Se quemó durante el servicio del mediodía, temperatura demasiado alta"
              />
              <div className="waste-form-hint">
                Cuantos más detalles proporciones, mejores recomendaciones podremos darte
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="waste-modal-footer">
          <button 
            type="button" 
            className="waste-btn waste-btn-secondary" 
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="waste-btn waste-btn-primary"
            onClick={handleSubmit}
          >
            <span className="waste-btn-icon">✓</span>
            Registrar Desperdicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasteRegistrationModal;