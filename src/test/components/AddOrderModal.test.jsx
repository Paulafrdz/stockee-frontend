import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOrderModal from '../../components/addOrderModal/AddOrderModal';

describe('AddOrderModal - Optimized Tests', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockIngredients = [
    { id: 1, name: 'Tomate', currentStock: 10, minimumStock: 5, unit: 'kg' },
    { id: 2, name: 'Cebolla', currentStock: 8, minimumStock: 3, unit: 'kg' },
    { id: 3, name: 'Ajo', currentStock: 2, minimumStock: 5, unit: 'kg' },
    { id: 4, name: 'Pimiento', currentStock: 15, minimumStock: 4, unit: 'kg' },
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

  // ==================== Rendering (4 tests) ====================

  describe('Rendering', () => {
    it('should not render when closed', () => {
      render(<AddOrderModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Añadir Ingrediente al Pedido')).not.toBeInTheDocument();
    });

    it('should render modal with all ingredients', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      expect(screen.getByText('Tomate')).toBeInTheDocument();
      expect(screen.getByText('Cebolla')).toBeInTheDocument();
      expect(screen.getByText('Ajo')).toBeInTheDocument();
      expect(screen.getByText('Pimiento')).toBeInTheDocument();
    });

    it('should show low stock warning', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      const ajoCard = screen.getByText('Ajo').closest('.add-order-modal-ingredient-card');
      expect(within(ajoCard).getByText('⚠️ Stock bajo')).toBeInTheDocument();
    });

    it('should disable submit button when no ingredient selected', () => {
      render(<AddOrderModal {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /añadir a la orden/i })).toBeDisabled();
    });
  });

  // ==================== Search (3 tests) ====================

  describe('Search', () => {
    it('should filter ingredients by search term', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Buscar ingrediente...'), 'Tom');
      
      expect(screen.getByText('Tomate')).toBeInTheDocument();
      expect(screen.queryByText('Cebolla')).not.toBeInTheDocument();
    });

    it('should be case insensitive', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Buscar ingrediente...'), 'TOMATE');
      
      expect(screen.getByText('Tomate')).toBeInTheDocument();
    });

    it('should show empty state when no matches', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Buscar ingrediente...'), 'xyz');
      
      expect(screen.getByText('No se encontraron ingredientes')).toBeInTheDocument();
    });
  });

  // ==================== Selection (4 tests) ====================

  describe('Ingredient Selection', () => {
    it('should select ingredient on click', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      const tomateCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
      await user.click(tomateCard);
      
      expect(tomateCard).toHaveClass('selected');
      expect(within(tomateCard).getByText('✓')).toBeInTheDocument();
    });

    it('should show quantity input after selection', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      
      expect(screen.getByText(/Cantidad \(kg\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Disponible: 10 kg/i)).toBeInTheDocument();
    });

    it('should enable submit button after selection', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      
      expect(screen.getByRole('button', { name: /añadir a la orden/i })).not.toBeDisabled();
    });

    it('should exclude already ordered ingredients', () => {
      const existingItems = [{ ingredientId: 2, ingredientName: 'Cebolla', quantity: 2, unit: 'kg' }];
      render(<AddOrderModal {...defaultProps} existingOrderItems={existingItems} />);
      
      expect(screen.getByText('Tomate')).toBeInTheDocument();
      expect(screen.queryByText('Cebolla')).not.toBeInTheDocument();
    });
  });

  // ==================== Validation (3 tests) ====================

  describe('Validation', () => {
    it('should not submit without quantity', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));
      
      await waitFor(() => expect(mockOnSubmit).not.toHaveBeenCalled());
    });

    it('should not submit with zero quantity', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      await user.type(screen.getByPlaceholderText('0'), '0');
      await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));
      
      await waitFor(() => expect(mockOnSubmit).not.toHaveBeenCalled());
    });

    it('should not submit when quantity exceeds stock', async () => {
      const user = userEvent.setup();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      await user.type(screen.getByPlaceholderText('0'), '15');
      await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));
      
      await waitFor(() => expect(mockOnSubmit).not.toHaveBeenCalled());
    });
  });

  // ==================== Submission (4 tests) ====================

  describe('Submission', () => {
    it('should submit with correct data', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      await user.type(screen.getByPlaceholderText('0'), '5');
      await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));
      
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
      
      await user.click(screen.getByText('Tomate'));
      await user.type(screen.getByPlaceholderText('0'), '5.5');
      await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));
      
      await waitFor(() => {
        const call = mockOnSubmit.mock.calls[0][0];
        expect(typeof call.quantity).toBe('number');
        expect(call.quantity).toBe(5.5);
      });
    });

    it('should close modal after success', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      await user.type(screen.getByPlaceholderText('0'), '5');
      await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));
      
      await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
    });

    it('should disable buttons while submitting', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      await user.type(screen.getByPlaceholderText('0'), '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir a la orden/i });
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
    });
  });

  // ==================== Error Handling (2 tests) ====================

  describe('Error Handling', () => {
    it('should display error on failure', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Network error'));
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      await user.type(screen.getByPlaceholderText('0'), '5');
      await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should keep modal open on error', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Error'));
      render(<AddOrderModal {...defaultProps} />);
      
      await user.click(screen.getByText('Tomate'));
      await user.type(screen.getByPlaceholderText('0'), '5');
      await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
      
      expect(screen.getByText('Añadir Ingrediente al Pedido')).toBeInTheDocument();
    });
  });
});