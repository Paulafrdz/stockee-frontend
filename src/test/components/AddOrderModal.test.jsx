import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOrderModal from '../../components/addOrderModal/AddOrderModal';

describe('AddOrderModal - Unit Tests', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockIngredients = [
    { id: 1, name: 'Tomate', currentStock: 10, minimumStock: 5, unit: 'kg' },
    { id: 2, name: 'Cebolla', currentStock: 8, minimumStock: 3, unit: 'kg' },
    { id: 3, name: 'Ajo', currentStock: 2, minimumStock: 5, unit: 'kg' }, // Low stock
    { id: 4, name: 'Pimiento', currentStock: 15, minimumStock: 4, unit: 'kg' },
  ];

  const mockExistingItems = [
    { ingredientId: 2, ingredientName: 'Cebolla', quantity: 2, unit: 'kg' },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    availableIngredients: mockIngredients,
    existingOrderItems: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Rendering Tests ====================

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<AddOrderModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Añadir Ingrediente al Pedido')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      expect(screen.getByText('Añadir Ingrediente al Pedido')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar ingrediente...')).toBeInTheDocument();
      expect(screen.getByText('Seleccionar Ingrediente')).toBeInTheDocument();
    });

    it('should render all available ingredients', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      expect(screen.getByText('Tomate')).toBeInTheDocument();
      expect(screen.getByText('Cebolla')).toBeInTheDocument();
      expect(screen.getByText('Ajo')).toBeInTheDocument();
      expect(screen.getByText('Pimiento')).toBeInTheDocument();
    });

    it('should display stock information for each ingredient', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      // There are multiple "Stock:" texts (one for each ingredient)
      const stockLabels = screen.getAllByText('Stock:');
      expect(stockLabels).toHaveLength(4); // 4 ingredients
      
      // Check that all ingredient cards are rendered with stock info
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      expect(within(tomateCard).getByText(/10/)).toBeInTheDocument();
      
      const cebollaCard = screen.getByText('Cebolla').closest('.add-order-modal-ingredient-card');
      expect(within(cebollaCard).getByText(/8/)).toBeInTheDocument();
    });

    it('should show low stock warning for ingredients below minimum', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      const ajoCard = screen.getByText('Ajo').closest('.add-order-modal-ingredient-card');
      expect(within(ajoCard).getByText('⚠️ Stock bajo')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /añadir a la orden/i })).toBeInTheDocument();
    });

    it('should have submit button disabled when no ingredient is selected', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      expect(submitButton).toBeDisabled();
    });
  });

  // ==================== Search Functionality Tests ====================

  describe('Search Functionality', () => {
    it('should filter ingredients based on search term', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Buscar ingrediente...');
      await user.type(searchInput, 'Tom');
      
      expect(screen.getByText('Tomate')).toBeInTheDocument();
      expect(screen.queryByText('Cebolla')).not.toBeInTheDocument();
      expect(screen.queryByText('Ajo')).not.toBeInTheDocument();
    });

    it('should be case insensitive when searching', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Buscar ingrediente...');
      await user.type(searchInput, 'TOMATE');
      
      expect(screen.getByText('Tomate')).toBeInTheDocument();
    });

    it('should show empty state when no ingredients match search', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Buscar ingrediente...');
      await user.type(searchInput, 'xyz');
      
      expect(screen.getByText('No se encontraron ingredientes')).toBeInTheDocument();
    });

    it('should clear search when modal reopens', () => {
      const { rerender } = render(<AddOrderModal {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Buscar ingrediente...');
      userEvent.type(searchInput, 'Tom');
      
      // Close modal
      rerender(<AddOrderModal {...defaultProps} isOpen={false} />);
      
      // Reopen modal
      rerender(<AddOrderModal {...defaultProps} isOpen={true} />);
      
      expect(screen.getByPlaceholderText('Buscar ingrediente...')).toHaveValue('');
    });
  });

  // ==================== Ingredient Selection Tests ====================

  describe('Ingredient Selection', () => {
    it('should select ingredient when clicked', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      expect(tomateCard).toHaveClass('selected');
      expect(within(tomateCard).getByText('✓')).toBeInTheDocument();
    });

    it('should show quantity input after selecting ingredient', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      expect(screen.getByText(/Cantidad \(kg\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Disponible: 10 kg/i)).toBeInTheDocument();
    });

    it('should enable submit button after selecting ingredient', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      expect(submitButton).toBeDisabled();
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      expect(submitButton).not.toBeDisabled();
    });

    it('should allow changing selected ingredient', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      const ajoCard = screen.getByText('Ajo').closest('.add-order-modal-ingredient-card');
      
      await user.click(tomateCard);
      expect(tomateCard).toHaveClass('selected');
      
      await user.click(ajoCard);
      expect(tomateCard).not.toHaveClass('selected');
      expect(ajoCard).toHaveClass('selected');
    });

    it('should exclude already ordered ingredients from list', () => {
      render(<AddOrderModal {...defaultProps} existingOrderItems={mockExistingItems} />);
      
      expect(screen.getByText('Tomate')).toBeInTheDocument();
      expect(screen.queryByText('Cebolla')).not.toBeInTheDocument(); // Already in order
      expect(screen.getByText('Ajo')).toBeInTheDocument();
    });
  });

  // ==================== Quantity Input Tests ====================

  describe('Quantity Input', () => {
    it('should update quantity when user types', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      expect(quantityInput).toHaveValue(5);
    });

    it('should show available stock hint', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      expect(screen.getByText('Disponible: 10 kg')).toBeInTheDocument();
    });

    it('should set max attribute to current stock', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      expect(quantityInput).toHaveAttribute('max', '10');
    });
  });

  // ==================== Validation Tests ====================

  describe('Form Validation', () => {
    it('should not submit without selecting ingredient', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      
      // Button should be disabled without selection
      expect(submitButton).toBeDisabled();
    });

    it('should not submit without quantity', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not submit with zero quantity', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '0');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not submit with negative quantity', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '-5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not submit when quantity exceeds stock', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '15'); // Stock is 10
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  // ==================== Submit Tests ====================

  describe('Form Submission', () => {
    it('should submit with correct data when form is valid', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          ingredientId: 1,
          ingredientName: 'Tomate',
          quantity: 5,
          unit: 'kg',
          currentStock: 10,
        });
      });
    });

    it('should convert quantity to number', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5.5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const call = mockOnSubmit.mock.calls[0][0];
        expect(typeof call.quantity).toBe('number');
        expect(call.quantity).toBe(5.5);
      });
    });

    it('should close modal after successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      const { rerender } = render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
      
      // Reopen modal
      rerender(<AddOrderModal {...defaultProps} isOpen={false} />);
      rerender(<AddOrderModal {...defaultProps} isOpen={true} />);
      
      expect(screen.queryByText(/Cantidad/i)).not.toBeInTheDocument();
    });

    it('should disable buttons while submitting', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });

  // ==================== Error Handling Tests ====================

  describe('Error Handling', () => {
    it('should display error message when submission fails', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Network error'));
      
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should display error and keep modal open when submission fails', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Server error'));
      
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      // Check error is displayed
      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
      
      // Modal should still be visible (title is still in document)
      expect(screen.getByText('Añadir Ingrediente al Pedido')).toBeInTheDocument();
    });
  });

  // ==================== Close Modal Tests ====================

  describe('Close Modal', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when X button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const closeButtons = screen.getAllByRole('button');
      const xButton = closeButtons[0]; // First button is the X
      await user.click(xButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form when closing', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);
      
      // Reopen
      rerender(<AddOrderModal {...defaultProps} isOpen={false} />);
      rerender(<AddOrderModal {...defaultProps} isOpen={true} />);
      
      expect(screen.queryByText(/Cantidad/i)).not.toBeInTheDocument();
    });

    it('should not allow closing while submitting', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      const quantityInput = screen.getByPlaceholderText('0');
      await user.type(quantityInput, '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  // ==================== Empty State Tests ====================

  describe('Empty States', () => {
    it('should show empty state when no ingredients available', () => {
      render(<AddOrderModal {...defaultProps} availableIngredients={[]} />);
      
      expect(screen.getByText('No hay ingredientes disponibles')).toBeInTheDocument();
    });

    it('should show search empty state when no matches found', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Buscar ingrediente...');
      await user.type(searchInput, 'nonexistent');
      
      expect(screen.getByText('No se encontraron ingredientes')).toBeInTheDocument();
    });

    it('should show empty state when all ingredients are already ordered', () => {
      const allOrderedItems = mockIngredients.map(ing => ({
        ingredientId: ing.id,
        ingredientName: ing.name,
        quantity: 1,
        unit: ing.unit,
      }));
      
      render(<AddOrderModal {...defaultProps} existingOrderItems={allOrderedItems} />);
      
      expect(screen.getByText('No hay ingredientes disponibles')).toBeInTheDocument();
    });
  });
});