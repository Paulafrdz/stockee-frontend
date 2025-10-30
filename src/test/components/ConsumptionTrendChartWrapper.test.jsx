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

describe('ConsumptionTrendChartWrapper - Unit Tests', () => {
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
    },
    {
      id: 4,
      ingredientName: 'Ajo',
      quantity: 1.5,
      timestamp: '2024-02-15T10:00:00Z'
    },
    {
      id: 5,
      ingredientName: 'Pimiento',
      quantity: 4,
      timestamp: '2024-03-05T10:00:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== Loading State Tests ====================

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      wasteService.getAllWaste.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<ConsumptionTrendChartWrapper />);
      
      expect(screen.getByText('Analizando consumo de ingredientes...')).toBeInTheDocument();
      expect(document.querySelector('.ingredients-consumption-spinner')).toBeInTheDocument();
    });

    it('should call getAllWaste on mount', () => {
      wasteService.getAllWaste.mockResolvedValue([]);
      
      render(<ConsumptionTrendChartWrapper />);
      
      expect(wasteService.getAllWaste).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== Successful Data Loading Tests ====================

  describe('Successful Data Loading', () => {
    it('should render chart after successful data fetch', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      });
    });

    it('should hide loading state after data loads', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        expect(screen.queryByText('Analizando consumo de ingredientes...')).not.toBeInTheDocument();
      });
    });

    it('should process waste data correctly', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        expect(data).toHaveLength(3); // 3 months of data
        expect(data[0]).toHaveProperty('month');
        expect(data[0]).toHaveProperty('totalConsumption');
        expect(data[0]).toHaveProperty('topIngredients');
      });
    });

    it('should group data by month correctly', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        // Should have Ene (Jan), Feb, Mar
        const months = data.map(d => d.month);
        expect(months).toContain('Ene');
        expect(months).toContain('Feb');
        expect(months).toContain('Mar');
      });
    });

    it('should calculate total consumption per month', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        const janData = data.find(d => d.month === 'Ene');
        expect(janData.totalConsumption).toBe(8); // 5 + 3
        
        const febData = data.find(d => d.month === 'Feb');
        expect(febData.totalConsumption).toBe(3.5); // 2 + 1.5
      });
    });

    it('should group consumption by ingredient', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        const janData = data.find(d => d.month === 'Ene');
        expect(janData.topIngredients).toHaveLength(2); // Tomate and Cebolla
        
        const tomateData = janData.topIngredients.find(i => i.name === 'Tomate');
        expect(tomateData.consumed).toBe(5);
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

    it('should sort top ingredients by consumption descending', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        const janData = data.find(d => d.month === 'Ene');
        expect(janData.topIngredients[0].consumed).toBeGreaterThanOrEqual(
          janData.topIngredients[1].consumed
        );
      });
    });

    it('should round consumption values to 2 decimals', async () => {
      const dataWithDecimals = [
        { id: 1, ingredientName: 'Tomate', quantity: 5.666, timestamp: '2024-01-15T10:00:00Z' }
      ];
      
      wasteService.getAllWaste.mockResolvedValue(dataWithDecimals);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        expect(data[0].totalConsumption).toBe(5.67);
      });
    });

    it('should limit to last 6 months of data', async () => {
      const manyMonths = [];
      for (let i = 0; i < 12; i++) {
        manyMonths.push({
          id: i,
          ingredientName: 'Test',
          quantity: 1,
          timestamp: `2024-${String(i + 1).padStart(2, '0')}-15T10:00:00Z`
        });
      }
      
      wasteService.getAllWaste.mockResolvedValue(manyMonths);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        expect(data.length).toBeLessThanOrEqual(6);
      });
    });

    it('should handle empty waste data', async () => {
      wasteService.getAllWaste.mockResolvedValue([]);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        expect(data).toEqual([]);
      });
    });

    it('should handle waste entries without ingredientName', async () => {
      const dataWithoutName = [
        { id: 1, quantity: 5, timestamp: '2024-01-15T10:00:00Z' }
      ];
      
      wasteService.getAllWaste.mockResolvedValue(dataWithoutName);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        expect(data[0].topIngredients[0].name).toBe('Ingrediente desconocido');
      });
    });

    it('should handle waste entries without quantity', async () => {
      const dataWithoutQuantity = [
        { id: 1, ingredientName: 'Tomate', timestamp: '2024-01-15T10:00:00Z' }
      ];
      
      wasteService.getAllWaste.mockResolvedValue(dataWithoutQuantity);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        expect(data[0].totalConsumption).toBe(0);
      });
    });
  });

  // ==================== Error Handling Tests ====================

  describe('Error Handling', () => {
    it('should show error message when fetch fails', async () => {
      wasteService.getAllWaste.mockRejectedValue(new Error('Network error'));
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        expect(screen.getByText(/Error al cargar los datos de consumo/i)).toBeInTheDocument();
      });
    });

    it('should show error icon in error state', async () => {
      wasteService.getAllWaste.mockRejectedValue(new Error('Network error'));
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        expect(screen.getByText(/⚠️/)).toBeInTheDocument();
      });
    });

    it('should show retry button when error occurs', async () => {
      wasteService.getAllWaste.mockRejectedValue(new Error('Network error'));
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
      });
    });

    it('should display server error message when available', async () => {
      const serverError = {
        response: {
          data: {
            message: 'Database connection failed'
          }
        }
      };
      
      wasteService.getAllWaste.mockRejectedValue(serverError);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        expect(screen.getByText(/Database connection failed/i)).toBeInTheDocument();
      });
    });

    it('should retry fetching data when retry button is clicked', async () => {
      const user = userEvent.setup();
      wasteService.getAllWaste
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText(/Error al cargar los datos de consumo/i)).toBeInTheDocument();
      });
      
      // Click retry
      const retryButton = screen.getByRole('button', { name: /reintentar/i });
      await user.click(retryButton);
      
      // Should fetch again
      expect(wasteService.getAllWaste).toHaveBeenCalledTimes(2);
      
      // Should show chart after successful retry
      await waitFor(() => {
        expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      });
    });

    it('should show loading state during retry', async () => {
      const user = userEvent.setup();
      wasteService.getAllWaste
        .mockRejectedValueOnce(new Error('Network error'))
        .mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        expect(screen.getByText(/Error al cargar los datos de consumo/i)).toBeInTheDocument();
      });
      
      const retryButton = screen.getByRole('button', { name: /reintentar/i });
      await user.click(retryButton);
      
      expect(screen.getByText('Analizando consumo de ingredientes...')).toBeInTheDocument();
    });

    it('should handle errors in data processing gracefully', async () => {
      // Data that might cause processing errors
      const invalidData = [
        { id: 1, ingredientName: 'Test', quantity: 'invalid', timestamp: 'invalid-date' }
      ];
      
      wasteService.getAllWaste.mockResolvedValue(invalidData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      // Should still render without crashing
      await waitFor(() => {
        expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      });
    });
  });

  // ==================== Month Name Tests ====================

  describe('Month Name Formatting', () => {
    it('should format month names correctly in Spanish', async () => {
      const monthlyData = [
        { id: 1, ingredientName: 'Test', quantity: 1, timestamp: '2024-01-15T10:00:00Z' },
        { id: 2, ingredientName: 'Test', quantity: 1, timestamp: '2024-02-15T10:00:00Z' },
        { id: 3, ingredientName: 'Test', quantity: 1, timestamp: '2024-03-15T10:00:00Z' },
        { id: 4, ingredientName: 'Test', quantity: 1, timestamp: '2024-12-15T10:00:00Z' },
      ];
      
      wasteService.getAllWaste.mockResolvedValue(monthlyData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        const months = data.map(d => d.month);
        expect(months).toContain('Ene'); // January
        expect(months).toContain('Feb'); // February
        expect(months).toContain('Mar'); // March
        expect(months).toContain('Dic'); // December
      });
    });

    it('should sort months chronologically', async () => {
      // Data in random order
      const unsortedData = [
        { id: 1, ingredientName: 'Test', quantity: 1, timestamp: '2024-06-15T10:00:00Z' },
        { id: 2, ingredientName: 'Test', quantity: 1, timestamp: '2024-02-15T10:00:00Z' },
        { id: 3, ingredientName: 'Test', quantity: 1, timestamp: '2024-04-15T10:00:00Z' },
      ];
      
      wasteService.getAllWaste.mockResolvedValue(unsortedData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const data = JSON.parse(chartData.textContent);
        
        const months = data.map(d => d.month);
        expect(months).toEqual(['Feb', 'Abr', 'Jun']);
      });
    });
  });

  // ==================== Integration Tests ====================

  describe('Component Lifecycle', () => {
    it('should not fetch data multiple times on single mount', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      await waitFor(() => {
        expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      });
      
      // Should only call once on mount
      expect(wasteService.getAllWaste).toHaveBeenCalledTimes(1);
    });

    it('should transition from loading to success state', async () => {
      wasteService.getAllWaste.mockResolvedValue(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      // Should start with loading
      expect(screen.getByText('Analizando consumo de ingredientes...')).toBeInTheDocument();
      
      // Should transition to success
      await waitFor(() => {
        expect(screen.queryByText('Analizando consumo de ingredientes...')).not.toBeInTheDocument();
        expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      });
    });

    it('should transition from loading to error state', async () => {
      wasteService.getAllWaste.mockRejectedValue(new Error('Network error'));
      
      render(<ConsumptionTrendChartWrapper />);
      
      // Should start with loading
      expect(screen.getByText('Analizando consumo de ingredientes...')).toBeInTheDocument();
      
      // Should transition to error
      await waitFor(() => {
        expect(screen.queryByText('Analizando consumo de ingredientes...')).not.toBeInTheDocument();
        expect(screen.getByText(/Error al cargar los datos de consumo/i)).toBeInTheDocument();
      });
    });

    it('should transition from error to success after retry', async () => {
      const user = userEvent.setup();
      wasteService.getAllWaste
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockWasteData);
      
      render(<ConsumptionTrendChartWrapper />);
      
      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/Error al cargar los datos de consumo/i)).toBeInTheDocument();
      });
      
      // Retry
      const retryButton = screen.getByRole('button', { name: /reintentar/i });
      await user.click(retryButton);
      
      // Should transition to success
      await waitFor(() => {
        expect(screen.queryByText(/Error al cargar los datos de consumo/i)).not.toBeInTheDocument();
        expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      });
    });
  });
});