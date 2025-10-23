import React, { useState, useEffect } from 'react';
import { X, Search, AlertCircle } from 'lucide-react';
import Input from '../inputLog/InputLog';
import Button from '../button/Button';
import './AddOrderModal.css';

const AddOrderModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  availableIngredients = [], // Lista de ingredientes del stock
  existingOrderItems = [] // Items ya agregados a la orden
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedIngredient(null);
    setQuantity('');
    setSearchTerm('');
    setErrors({});
  };

  // Filtrar ingredientes disponibles
  const filteredIngredients = availableIngredients.filter(ingredient => {
    // Excluir ingredientes ya agregados a la orden
    const alreadyInOrder = existingOrderItems.some(
      item => item.ingredientId === ingredient.id
    );
    
    // Filtrar por búsqueda
    const matchesSearch = ingredient.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    return !alreadyInOrder && matchesSearch;
  });

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredient(ingredient);
    setErrors(prev => ({ ...prev, ingredient: '' }));
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);
    
    if (errors.quantity) {
      setErrors(prev => ({ ...prev, quantity: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedIngredient) {
      newErrors.ingredient = 'Debes seleccionar un ingrediente';
    }
    
    if (!quantity) {
      newErrors.quantity = 'La cantidad es requerida';
    } else if (isNaN(quantity) || parseFloat(quantity) <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    } else if (selectedIngredient && parseFloat(quantity) > selectedIngredient.currentStock) {
      newErrors.quantity = `Stock insuficiente. Disponible: ${selectedIngredient.currentStock} ${selectedIngredient.unit}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const orderItem = {
        ingredientId: selectedIngredient.id,
        ingredientName: selectedIngredient.name,
        quantity: parseFloat(quantity),
        unit: selectedIngredient.unit,
        currentStock: selectedIngredient.currentStock
      };
      
      await onSubmit(orderItem);
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('❌ Error al agregar ingrediente:', error);
      setErrors({ 
        submit: error.message || 'Error al agregar el ingrediente a la orden' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-order-modal-overlay" onClick={handleClose}>
      <div className="add-order-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="add-order-modal-header">
          <h2 className="add-order-modal-title">
            Añadir Ingrediente a la Orden
          </h2>
          <button 
            className="add-order-modal-close-button"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="add-order-modal-form">
          
          {/* Search Bar */}
          <div className="add-order-modal-search-container">
            <div className="add-order-modal-search-wrapper">
              <Search size={20} className="add-order-modal-search-icon" />
              <input
                type="text"
                className="add-order-modal-search-input"
                placeholder="Buscar ingrediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Ingredient List */}
          <div className="add-order-modal-field">
            <label className="add-order-modal-label required">
              Seleccionar Ingrediente
            </label>
            
            <div className="add-order-modal-ingredient-list">
              {filteredIngredients.length === 0 ? (
                <div className="add-order-modal-empty-state">
                  <AlertCircle size={32} />
                  <p>
                    {searchTerm 
                      ? 'No se encontraron ingredientes' 
                      : 'No hay ingredientes disponibles'}
                  </p>
                </div>
              ) : (
                filteredIngredients.map(ingredient => (
                  <div
                    key={ingredient.id}
                    className={`add-order-modal-ingredient-card ${
                      selectedIngredient?.id === ingredient.id ? 'selected' : ''
                    } ${
                      ingredient.currentStock <= ingredient.minimumStock ? 'low-stock' : ''
                    }`}
                    onClick={() => handleIngredientSelect(ingredient)}
                  >
                    <div className="add-order-modal-ingredient-info">
                      <h4 className="add-order-modal-ingredient-name">{ingredient.name}</h4>
                      <div className="add-order-modal-ingredient-details">
                        <span className="add-order-modal-stock-info">
                          Stock: <strong>{ingredient.currentStock} {ingredient.unit}</strong>
                        </span>
                        {ingredient.currentStock <= ingredient.minimumStock && (
                          <span className="add-order-modal-stock-warning">
                            ⚠️ Stock bajo
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="add-order-modal-select-indicator">
                      {selectedIngredient?.id === ingredient.id && (
                        <div className="add-order-modal-checkmark">✓</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {errors.ingredient && (
              <div className="add-order-modal-input-error">{errors.ingredient}</div>
            )}
          </div>

          {/* Quantity Input - Solo visible si hay ingrediente seleccionado */}
          {selectedIngredient && (
            <div className="add-order-modal-field add-order-modal-quantity-field">
              <Input
                type="number"
                label={`Cantidad (${selectedIngredient.unit})`}
                placeholder="0"
                value={quantity}
                onChange={handleQuantityChange}
                error={errors.quantity}
                required
                disabled={isLoading}
                min="0"
                step="0.1"
                max={selectedIngredient.currentStock}
              />
              <div className="add-order-modal-quantity-hint">
                Disponible: {selectedIngredient.currentStock} {selectedIngredient.unit}
              </div>
            </div>
          )}

          {/* Error de submit */}
          {errors.submit && (
            <div className="add-order-modal-form-error">
              {errors.submit}
            </div>
          )}

          {/* Buttons */}
          <div className="add-order-modal-actions">
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
              disabled={isLoading || !selectedIngredient}
            >
              Añadir a la Orden
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;