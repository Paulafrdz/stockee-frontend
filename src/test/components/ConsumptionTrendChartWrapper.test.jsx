import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConsumptionTrendChartWrapper from '../../components/consumptionTrendChart/ConsumptionTrendChartWrapper';
import * as wasteService from '../../services/wasteService';

// Mock the service
vi.mock('../../services/wasteService');

// Mock the chart component
vi.mock('../../components/consumptionTrendChart/ConsumptionTrendChart', () => ({
  default: ({ data }) => (
    <div data-testid="consumption-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  )
}));

describe('ConsumptionTrendChartWrapper', () => {
  const mockWasteData = [
    {
      id: 1,
      ingredientName: 'Tomate',
      quantity: 5,
      timestamp: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      ingredientName: 'Cebolla',
      quantity: 3,
      timestamp: '2024-01-20T10:00:00Z'
    },
    {
      id: 3,
      ingredientName: 'Tomate',
      quantity: 2,
      timestamp: '2024-02-10T10:00:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== Loading State ====================

  it('should show loading state initially', () => {
    wasteService.getAllWaste.mockImplementation(() => new Promise(() => {}));
    
    render(<ConsumptionTrendChartWrapper />);
    
    expect(screen.getByText('Analizando consumo de ingredientes...')).toBeInTheDocument();
    expect(document.querySelector('.ingredients-consumption-spinner')).toBeInTheDocument();
  });

  // ==================== Successful Data Loading ====================

  it('should render chart after successful data fetch', async () => {
    wasteService.getAllWaste.mockResolvedValue(mockWasteData);
    
    render(<ConsumptionTrendChartWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      expect(screen.queryByText('Analizando consumo de ingredientes...')).not.toBeInTheDocument();
    });
  });

  it('should process and group waste data correctly by month', async () => {
    wasteService.getAllWaste.mockResolvedValue(mockWasteData);
    
    render(<ConsumptionTrendChartWrapper />);
    
    await waitFor(() => {
      const chartData = screen.getByTestId('chart-data');
      const data = JSON.parse(chartData.textContent);
      
      expect(data).toHaveLength(2); // Jan and Feb
      expect(data[0]).toHaveProperty('month');
      expect(data[0]).toHaveProperty('totalConsumption');
      expect(data[0]).toHaveProperty('topIngredients');
      
      const janData = data.find(d => d.month === 'Ene');
      expect(janData.totalConsumption).toBe(8); // 5 + 3
    });
  });

  it('should limit to top 3 ingredients per month', async () => {
    const manyIngredients = [
      { id: 1, ingredientName: 'Ingredient1', quantity: 10, timestamp: '2024-01-15T10:00:00Z' },
      { id: 2, ingredientName: 'Ingredient2', quantity: 8, timestamp: '2024-01-15T10:00:00Z' },
      { id: 3, ingredientName: 'Ingredient3', quantity: 6, timestamp: '2024-01-15T10:00:00Z' },
      { id: 4, ingredientName: 'Ingredient4', quantity: 4, timestamp: '2024-01-15T10:00:00Z' },
      { id: 5, ingredientName: 'Ingredient5', quantity: 2, timestamp: '2024-01-15T10:00:00Z' },
    ];
    
    wasteService.getAllWaste.mockResolvedValue(manyIngredients);
    
    render(<ConsumptionTrendChartWrapper />);
    
    await waitFor(() => {
      const chartData = screen.getByTestId('chart-data');
      const data = JSON.parse(chartData.textContent);
      
      expect(data[0].topIngredients).toHaveLength(3);
    });
  });

  it('should handle empty and invalid data', async () => {
    wasteService.getAllWaste.mockResolvedValue([]);
    
    render(<ConsumptionTrendChartWrapper />);
    
    await waitFor(() => {
      const chartData = screen.getByTestId('chart-data');
      const data = JSON.parse(chartData.textContent);
      
      expect(data).toEqual([]);
    });
  });

  // ==================== Error Handling ====================

  it('should show error message and retry button when fetch fails', async () => {
    wasteService.getAllWaste.mockRejectedValue(new Error('Network error'));
    
    render(<ConsumptionTrendChartWrapper />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar los datos de consumo/i)).toBeInTheDocument();
      expect(screen.getByText(/⚠️/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
    });
  });

  it('should retry fetching data when retry button is clicked', async () => {
    const user = userEvent.setup();
    wasteService.getAllWaste
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockWasteData);
    
    render(<ConsumptionTrendChartWrapper />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar los datos de consumo/i)).toBeInTheDocument();
    });
    
    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    await user.click(retryButton);
    
    expect(wasteService.getAllWaste).toHaveBeenCalledTimes(2);
    
    await waitFor(() => {
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
    });
  });

  // ==================== Component Lifecycle ====================

  it('should transition through loading, error, and success states', async () => {
    const user = userEvent.setup();
    wasteService.getAllWaste
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockWasteData);
    
    render(<ConsumptionTrendChartWrapper />);
    
    // Loading state
    expect(screen.getByText('Analizando consumo de ingredientes...')).toBeInTheDocument();
    
    // Error state
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar los datos de consumo/i)).toBeInTheDocument();
    });
    
    // Retry and success
    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    await user.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
    });
  });
});