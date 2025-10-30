import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddIngredientModal from '../../components/addIngredientModal/AddIngredientModal';

describe('AddIngredientModal - Optimized Tests', () => {
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

  // ==================== Rendering (4 tests) ====================

  describe('Rendering', () => {
    it('should not render when closed', () => {
      render(<AddIngredientModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Añadir Ingrediente al Stock')).not.toBeInTheDocument();
    });

    it('should render in add mode by default', () => {
      render(<AddIngredientModal {...defaultProps} />);
      expect(screen.getByText('Añadir Ingrediente al Stock')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /añadir al inventario/i })).toBeInTheDocument();
    });

    it('should render in edit mode with initial data', () => {
      const editData = { id: 1, name: 'Tomate', currentStock: 10, minimumStock: 5, unit: 'kg' };
      render(<AddIngredientModal {...defaultProps} initialData={editData} />);
      
      expect(screen.getByText('Editar Ingrediente')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toHaveValue('Tomate');
    });

    it('should render all form fields', () => {
      render(<AddIngredientModal {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('10')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('5')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  // ==================== User Interactions (4 tests) ====================

  describe('User Interactions', () => {
    it('should update form fields when user types', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '15');
      await user.selectOptions(screen.getByRole('combobox'), 'L');
      
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toHaveValue('Tomate');
      expect(screen.getByPlaceholderText('10')).toHaveValue(15);
      expect(screen.getByRole('combobox')).toHaveValue('L');
    });

    it('should allow form submission after fixing errors', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      render(<AddIngredientModal {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => expect(mockOnSubmit).not.toHaveBeenCalled());
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      await user.click(submitButton);
      
      await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1));
    });

    it('should reset form when switching modes', () => {
      const editData = { id: 1, name: 'Tomate', currentStock: 10, minimumStock: 5, unit: 'kg' };
      const { rerender } = render(<AddIngredientModal {...defaultProps} initialData={editData} />);
      
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toHaveValue('Tomate');
      
      rerender(<AddIngredientModal {...defaultProps} initialData={null} />);
      expect(screen.getByPlaceholderText('Ej: Tomates Cherry')).toHaveValue('');
    });

    it('should close modal on cancel', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.click(screen.getByRole('button', { name: /cancelar/i }));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // ==================== Validation (4 tests) ====================

  describe('Validation', () => {
    it('should not submit with empty fields', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => expect(mockOnSubmit).not.toHaveBeenCalled());
    });

    it('should not submit with invalid stock values', async () => {
      const user = userEvent.setup();
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '-5');
      await user.type(screen.getByPlaceholderText('5'), '3');
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => expect(mockOnSubmit).not.toHaveBeenCalled());
    });

    it('should submit with valid data', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '15');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Tomate',
          currentStock: 15,
          minimumStock: 5,
          unit: 'kg',
        });
      });
    });

    it('should include id when editing', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      const editData = { id: 42, name: 'Tomate', currentStock: 10, minimumStock: 5, unit: 'kg' };
      
      render(<AddIngredientModal {...defaultProps} initialData={editData} />);
      
      await user.click(screen.getByRole('button', { name: /actualizar ingrediente/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }));
      });
    });
  });

  // ==================== Submission (4 tests) ====================

  describe('Submission', () => {
    it('should trim whitespace from name', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), '  Tomate  ');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Tomate' }));
      });
    });

    it('should convert values to numbers', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue();
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10.5');
      await user.type(screen.getByPlaceholderText('5'), '5.2');
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => {
        const call = mockOnSubmit.mock.calls[0][0];
        expect(typeof call.currentStock).toBe('number');
        expect(call.currentStock).toBe(10.5);
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
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
    });

    it('should not close on submission error', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Server error'));
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  // ==================== Error Handling (4 tests) ====================

  describe('Error Handling', () => {
    it('should display error message on failure', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Network error'));
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should display server error message', async () => {
      const user = userEvent.setup();
      const serverError = {
        response: { data: { message: 'Ingrediente ya existe' } }
      };
      mockOnSubmit.mockRejectedValue(serverError);
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/ingrediente ya existe/i)).toBeInTheDocument();
      });
    });

    it('should display connection error', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue({ request: {} });
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      await user.click(screen.getByRole('button', { name: /añadir al inventario/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/no se pudo conectar al servidor/i)).toBeInTheDocument();
      });
    });

    it('should re-enable buttons after error', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Error'));
      render(<AddIngredientModal {...defaultProps} />);
      
      await user.type(screen.getByPlaceholderText('Ej: Tomates Cherry'), 'Tomate');
      await user.type(screen.getByPlaceholderText('10'), '10');
      await user.type(screen.getByPlaceholderText('5'), '5');
      
      const submitButton = screen.getByRole('button', { name: /añadir al inventario/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
      
      expect(submitButton).not.toBeDisabled();
    });
  });
});