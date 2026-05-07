import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddIngredientModal from '../../components/addIngredientModal/AddIngredientModal';

describe('AddIngredientModal', () => {
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

  it('should not render when closed', () => {
    render(<AddIngredientModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/añadir ingrediente al stock/i)).not.toBeInTheDocument();
  });

  it('should render add mode', () => {
    render(<AddIngredientModal {...defaultProps} />);
    expect(screen.getByText(/añadir ingrediente al stock/i)).toBeInTheDocument();
  });

  it('should render edit mode', () => {
    render(
      <AddIngredientModal
        {...defaultProps}
        initialData={{
          id: 1,
          name: 'Tomate',
          currentStock: 10,
          minimumStock: 5,
          unit: 'kg',
        }}
      />
    );

    expect(screen.getByText(/editar ingrediente/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tomate')).toBeInTheDocument();
  });

  it('should update form inputs', async () => {
    const user = userEvent.setup();
    render(<AddIngredientModal {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText(/ej: tomates cherry/i),
      'Tomate'
    );

    await user.type(screen.getByLabelText(/stock actual/i), '10');
    await user.type(screen.getByLabelText(/stock mínimo/i), '5');

    expect(screen.getByDisplayValue('Tomate')).toBeInTheDocument();
  });

  it('should not submit empty form', async () => {
    const user = userEvent.setup();
    render(<AddIngredientModal {...defaultProps} />);

    await user.click(
      screen.getByRole('button', { name: /añadir al inventario/i })
    );

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

it('should submit valid data', async () => {
  const user = userEvent.setup();
  mockOnSubmit.mockResolvedValue(undefined);

  render(<AddIngredientModal {...defaultProps} />);

  await user.type(screen.getByLabelText(/nombre del ingrediente/i), 'Tomate');
  await user.type(screen.getByLabelText(/stock actual/i), '10');
  await user.type(screen.getByLabelText(/stock mínimo/i), '5');

  // Get all comboboxes (selects)
  const [unitSelect, shelfLifeSelect] = screen.getAllByRole('combobox');

  // Optionally select values if needed
  await user.selectOptions(unitSelect, 'kg');
  await user.selectOptions(shelfLifeSelect, '7');

  await user.click(
    screen.getByRole('button', { name: /añadir al inventario/i })
  );

  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Tomate',
        currentStock: 10,
        minimumStock: 5,
        unit: 'kg',
        shelfLifeDays: expect.any(Number),
      })
    );
  });
});

  it('should trim name before submit', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<AddIngredientModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/nombre del ingrediente/i), '  Tomate  ');
    await user.type(screen.getByLabelText(/stock actual/i), '10');
    await user.type(screen.getByLabelText(/stock mínimo/i), '5');

    await user.click(
      screen.getByRole('button', { name: /añadir al inventario/i })
    );

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Tomate',
        })
      );
    });
  });

  it('should handle network error', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    render(<AddIngredientModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/nombre del ingrediente/i), 'Tomate');
    await user.type(screen.getByLabelText(/stock actual/i), '10');
    await user.type(screen.getByLabelText(/stock mínimo/i), '5');

    await user.click(
      screen.getByRole('button', { name: /añadir al inventario/i })
    );

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  it('should show server error', async () => {
    const user = userEvent.setup();

    mockOnSubmit.mockRejectedValue({
      response: { data: { message: 'Ingrediente ya existe' } },
    });

    render(<AddIngredientModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/nombre del ingrediente/i), 'Tomate');
    await user.type(screen.getByLabelText(/stock actual/i), '10');
    await user.type(screen.getByLabelText(/stock mínimo/i), '5');

    await user.click(
      screen.getByRole('button', { name: /añadir al inventario/i })
    );

    expect(await screen.findByText(/ingrediente ya existe/i)).toBeInTheDocument();
  });

  it('should show connection error', async () => {
    const user = userEvent.setup();

    mockOnSubmit.mockRejectedValue({ request: {} });

    render(<AddIngredientModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/nombre del ingrediente/i), 'Tomate');
    await user.type(screen.getByLabelText(/stock actual/i), '10');
    await user.type(screen.getByLabelText(/stock mínimo/i), '5');

    await user.click(
      screen.getByRole('button', { name: /añadir al inventario/i })
    );

    expect(await screen.findByText(/no se pudo conectar al servidor/i)).toBeInTheDocument();
  });

  it('should disable button while loading', async () => {
    const user = userEvent.setup();

    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<AddIngredientModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/nombre del ingrediente/i), 'Tomate');
    await user.type(screen.getByLabelText(/stock actual/i), '10');
    await user.type(screen.getByLabelText(/stock mínimo/i), '5');

    const button = screen.getByRole('button', {
      name: /añadir al inventario/i,
    });

    await user.click(button);

    expect(button).toBeDisabled();
  });
});