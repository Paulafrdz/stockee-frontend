import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOrderModal from '../../components/addOrderModal/AddOrderModal';

describe('AddOrderModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const ingredients = [
    { id: 1, name: 'Tomate', currentStock: 10, minimumStock: 5, unit: 'kg' },
    { id: 2, name: 'Cebolla', currentStock: 8, minimumStock: 3, unit: 'kg' },
    { id: 3, name: 'Ajo', currentStock: 2, minimumStock: 5, unit: 'kg' },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    availableIngredients: ingredients,
    existingOrderItems: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(<AddOrderModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/añadir ingrediente/i)).not.toBeInTheDocument();
  });

  it('should render ingredients', () => {
    render(<AddOrderModal {...defaultProps} />);
    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.getByText('Cebolla')).toBeInTheDocument();
  });

  it('should show low stock warning', () => {
    render(<AddOrderModal {...defaultProps} />);
    const ajoCard = screen.getByText('Ajo').closest('.add-order-modal-ingredient-card');

    expect(ajoCard).not.toBeNull();
    expect(within(ajoCard).getByText(/stock bajo/i)).toBeInTheDocument();
  });

  it('should filter ingredients', async () => {
    const user = userEvent.setup();
    render(<AddOrderModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText(/buscar/i), 'tom');

    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.queryByText('Cebolla')).not.toBeInTheDocument();
  });

  it('should select ingredient and enable submit', async () => {
    const user = userEvent.setup();
    render(<AddOrderModal {...defaultProps} />);

    const tomatoCard = screen.getByText('Tomate').closest('.add-order-modal-ingredient-card');
    expect(tomatoCard).not.toBeNull();
    await user.click(tomatoCard);

    const submitBtn = screen.getByRole('button', { name: /añadir a la orden/i });

    expect(submitBtn).not.toBeDisabled();
  });

  it('should submit correctly', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<AddOrderModal {...defaultProps} />);

    await user.click(screen.getByText('Tomate'));

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '5');

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

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not submit invalid quantity', async () => {
    const user = userEvent.setup();
    render(<AddOrderModal {...defaultProps} />);

    await user.click(screen.getByText('Tomate'));

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '0');

    await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('should show error on submit failure', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    render(<AddOrderModal {...defaultProps} />);

    await user.click(screen.getByText('Tomate'));

    const input = screen.getByRole('spinbutton');
    await user.type(input, '5');

    await user.click(screen.getByRole('button', { name: /añadir a la orden/i }));

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });
});