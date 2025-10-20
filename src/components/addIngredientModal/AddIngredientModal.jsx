import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import './AddIngredientModal.css';

const AddIngredientModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    stockActual: '',
    stockMinimo: '',
    unidad: 'kg'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const unidades = [
    { value: 'kg', label: 'kg' },
    { value: 'g', label: 'g' },
    { value: 'L', label: 'L' },
    { value: 'ml', label: 'ml' },
    { value: 'unidades', label: 'unidades' },
    { value: 'paquetes', label: 'paquetes' }
  ];

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del ingrediente es requerido';
    }
    
    if (!formData.stockActual) {
      newErrors.stockActual = 'El stock actual es requerido';
    } else if (isNaN(formData.stockActual) || parseFloat(formData.stockActual) < 0) {
      newErrors.stockActual = 'Debe ser un número válido mayor o igual a 0';
    }
    
    if (!formData.stockMinimo) {
      newErrors.stockMinimo = 'El stock mínimo es requerido';
    } else if (isNaN(formData.stockMinimo) || parseFloat(formData.stockMinimo) < 0) {
      newErrors.stockMinimo = 'Debe ser un número válido mayor o igual a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const ingredientData = {
        nombre: formData.nombre.trim(),
        stockActual: parseFloat(formData.stockActual),
        stockMinimo: parseFloat(formData.stockMinimo),
        unidad: formData.unidad
      };
      
      await onSubmit(ingredientData);
      
      // Resetear formulario y cerrar modal
      setFormData({
        nombre: '',
        stockActual: '',
        stockMinimo: '',
        unidad: 'kg'
      });
      setErrors({});
      onClose();
      
    } catch (error) {
      setErrors({ submit: error.message || 'Error al añadir el ingrediente' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      // Resetear formulario al cerrar
      setFormData({
        nombre: '',
        stockActual: '',
        stockMinimo: '',
        unidad: 'kg'
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Añadir Ingrediente al Stock</h2>
          <button 
            className="modal-close-button"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Nombre del Ingrediente */}
          <div className="form-field">
            <Input
              type="text"
              label="Nombre del Ingrediente"
              placeholder="Ej: Tomates Cherry"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              error={errors.nombre}
              required
              disabled={isLoading}
            />
          </div>

          {/* Stock Actual y Stock Mínimo */}
          <div className="form-row">
            <div className="form-field">
              <Input
                type="number"
                label="Stock Actual"
                placeholder="10"
                value={formData.stockActual}
                onChange={handleChange('stockActual')}
                error={errors.stockActual}
                required
                disabled={isLoading}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-field">
              <Input
                type="number"
                label="Stock Mínimo"
                placeholder="5"
                value={formData.stockMinimo}
                onChange={handleChange('stockMinimo')}
                error={errors.stockMinimo}
                required
                disabled={isLoading}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Unidad */}
          <div className="form-field">
            <label className="input-label required">Unidad</label>
            <select 
              className="select-field"
              value={formData.unidad}
              onChange={handleChange('unidad')}
              disabled={isLoading}
              required
            >
              {unidades.map(unidad => (
                <option key={unidad.value} value={unidad.value}>
                  {unidad.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error de submit */}
          {errors.submit && (
            <div className="form-error">
              {errors.submit}
            </div>
          )}

          {/* Buttons */}
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
              Añadir al Inventario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIngredientModal;