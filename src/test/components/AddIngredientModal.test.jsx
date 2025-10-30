import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddIngredientModal from '../../components/addIngredientModal/AddIngredientModal';

describe('AddIngredientModal - Unit Tests', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    initialData: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Rendering Tests ====================

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<AddIngredientModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Añadir Ingrediente al Stock')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      render(<AddIngredientModal {...defaultProps} />);
      
      expect(screen.getByText('Añadir Ingrediente al Stock')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('10')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('5')).toBeInTheDocument();
      expect(screen.getByText('Unidad')).toBeInTheDocument();
    });

    it('should render all unit options', () => {
      render(<AddIngredientModal {...defaultProps} />);
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(6);
      expect(screen.getByRole('option', { name: 'kg' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'g' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'L' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ml' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'unites' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'paquetes' })).toBeInTheDocument();
    });

    it('should have kg as default unit', () => {
      render(<AddIngredientModal {...defaultProps} />);
      
      const unitSelect = screen.getByRole('combobox');
      expect(unitSelect.value).toBe('kg');
    });

    it('should render action buttons', () => {
      render(<AddIngredientModal {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /añadir al inventario/i })).toBeInTheDocument();
    });
  });

  // ==================== Edit Mode Tests ====================

  describe('Edit Mode', () => {
    const editData = {
      id: 1,
      name: 'Tomate',
      currentStock: 10,
      minimumStock: 5,
      unit: 'kg',
    };

    it('should render in edit mode with initial data', () => {
      render(<AddIngredientModal {...defaultProps} initialData={editData} />);
      
      expect(screen.getByText('Editar Ingrediente')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /actualizar ingrediente/i })).toBeInTheDocument();
    });

    it('should populate form with initial data', () => {
      render(<AddIngredientModal {...defaultProps} initialData={editData} />);
      
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toHaveValue('Tomate');
      expect(screen.getByPlaceholderText('10')).toHaveValue(10);
      expect(screen.getByPlaceholderText('5')).toHaveValue(5);
      expect(screen.getByRole('combobox')).toHaveValue('kg');
    });

    it('should reset form when switching from edit to add mode', () => {
      const { rerender } = render(
        <AddIngredientModal {...defaultProps} initialData={editData} />
      );
      
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toHaveValue('Tomate');
      
      rerender(<AddIngredientModal {...defaultProps} initialData={null} />);
      
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toHaveValue('');
      expect(screen.getByPlaceholderText('10')).toHaveValue(null);
      expect(screen.getByPlaceholderText('5')).toHaveValue(null);
    });
  });

  // ==================== User Interaction Tests ====================

  describe('User Interactions', () => {
    it('should update name field when user types', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const nameInput = screen.getByPlaceholderText('Ej: Tomates Cherry');
      await user.type(nameInput, 'Tomates Cherry');
      
      expect(nameInput).toHaveValue('Tomates Cherry');
    });

    it('should update stock fields when user types numbers', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const currentStockInput = screen.getByPlaceholderText('10');
      const minimumStockInput = screen.getByPlaceholderText('5');
      
      await user.type(currentStockInput, '10');
      await user.type(minimumStockInput, '5');
      
      expect(currentStockInput).toHaveValue(10);
      expect(minimumStockInput).toHaveValue(5);
    });

    it('should update unit when user selects different option', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const unitSelect = screen.getByRole('combobox');
      await user.selectOptions(unitSelect, 'L');
      
      expect(unitSelect).toHaveValue('L');
    });

    it('should allow form submission after fixing validation errors', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      render(<AddIngredientModal {...defaultProps} />);
      
      // First submit - should fail (empty form)
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
      
      // Fill form and submit again - should succeed
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });
  });

  // ==================== Validation Tests ====================

  describe('Form Validation', () => {
    it('should not submit when name is empty', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      // Wait a bit to ensure submit doesn't happen
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not submit when current stock is empty', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const nameInput = screen.getByPlaceholderText('Ej: Tomates Cherry');
      await user.type(nameInput, 'Tomate');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not submit when current stock is negative', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const nameInput = screen.getByPlaceholderText('Ej: Tomates Cherry');
      const currentStockInput = screen.getByPlaceholderText('10');
      
      await user.type(nameInput, 'Tomate');
      await user.type(currentStockInput, '-5');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not submit when minimum stock is empty', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const nameInput = screen.getByPlaceholderText('Ej: Tomates Cherry');
      const currentStockInput = screen.getByPlaceholderText('10');
      
      await user.type(nameInput, 'Tomate');
      await user.type(currentStockInput, '10');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not submit when form is completely empty', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should submit successfully when all fields are valid', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '15');
      await user.type(screen.getByPlaceholderText('5'), '3');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });
  });

  // ==================== Submit Tests ====================

  describe('Form Submission', () => {
    it('should call onSubmit with correct data when form is valid', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomates Cherry');
      await user.type(screen.getByPlaceholderText('10'), '10.5');
      await user.type(screen.getByPlaceholderText('5'), '5.2');
      await user.selectOptions(screen.getByRole('combobox'), 'kg');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Tomates Cherry',
          currentStock: 10.5,
          minimumStock: 5.2,
          unit: 'kg',
        });
      });
    });

    it('should include id when editing', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      const editData = {
        id: 42,
        name: 'Tomate',
        currentStock: 10,
        minimumStock: 5,
        unit: 'kg',
      };
      
      render(<AddIngredientModal {...defaultProps} initialData={editData} />);
      
      await user.clear(screen.getByPlaceholderText('Ej: Tomates Cherry'));
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate Editado');
      
      const submitButton = screen.getByRole('button', { name: /actualizar ingrediente/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          id: 42,
          name: 'Tomate Editado',
          currentStock: 10,
          minimumStock: 5,
          unit: 'kg',
        });
      });
    });

    it('should trim whitespace from name', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), '  Tomate  ');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Tomate',
          })
        );
      });
    });

    it('should disable buttons while submitting', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
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
      
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should display server error message', async () => {
      const user = userEvent.setup();
      const serverError = {
        response: {
          data: { message: 'Ingrediente ya existe' },
          status: 400,
          statusText: 'Bad Request',
        },
      };
      mockOnSubmit.mockRejectedValue(serverError);
      
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/ingrediente ya existe/i)).toBeInTheDocument();
      });
    });

    it('should display connection error when request fails', async () => {
      const user = userEvent.setup();
      const connectionError = {
        request: {},
        message: 'Connection failed',
      };
      mockOnSubmit.mockRejectedValue(connectionError);
      
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/no se pudo conectar al servidor/i)).toBeInTheDocument();
      });
    });
  });

  // ==================== Close Modal Tests ====================

  describe('Close Modal', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form when closing', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not allow closing while submitting', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      expect(cancelButton).toBeDisabled();
    });
  });
});