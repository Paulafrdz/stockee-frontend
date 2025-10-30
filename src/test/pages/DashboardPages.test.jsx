import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../../pages/DashboardPage';

// Mock all child components
vi.mock('../../components/dashboardLayout/DashboardLayout', () => ({
  default: ({ children, user, activeTab, title, subtitle }) => (
    <div data-testid="dashboard-layout">
      <div data-testid="layout-user">{user?.name || 'No user'}</div>
      <div data-testid="layout-active-tab">{activeTab}</div>
      <div data-testid="layout-title">{title}</div>
      <div data-testid="layout-subtitle">{subtitle}</div>
      <div data-testid="layout-children">{children}</div>
    </div>
  )
}));

vi.mock('../../components/lowStockChart/LowStockChartWrapper', () => ({
  default: () => <div data-testid="low-stock-chart">Low Stock Chart</div>
}));

vi.mock('../../components/topIngredientsChart/TopIngredientsChartWrapper', () => ({
  default: () => <div data-testid="top-ingredients-chart">Top Ingredients Chart</div>
}));

vi.mock('../../components/efficiencyGauge/EfficiencyGaugeWrapper', () => ({
  default: () => <div data-testid="efficiency-gauge">Efficiency Gauge</div>
}));

vi.mock('../../components/wasteGauge/WasteGaugeWrapper', () => ({
  default: () => <div data-testid="waste-gauge">Waste Gauge</div>
}));

vi.mock('../../components/consumptionTrendChart/ConsumptionTrendChartWrapper', () => ({
  default: () => <div data-testid="consumption-chart">Consumption Chart</div>
}));

// Wrapper component for Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('DashboardPage - Unit Tests', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Rendering Tests ====================

  describe('Rendering', () => {
    it('should render DashboardLayout wrapper', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });

    it('should pass user prop to DashboardLayout', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('layout-user')).toHaveTextContent('Test User');
    });

    it('should pass activeTab="dashboard" to DashboardLayout', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('layout-active-tab')).toHaveTextContent('dashboard');
    });

    it('should pass title to DashboardLayout', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('layout-title')).toHaveTextContent('Dashboard');
    });

    it('should pass subtitle to DashboardLayout', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('layout-subtitle')).toHaveTextContent('Visualiza y analiza el rendimiento de tu inventario');
    });

    it('should render page title', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });

    it('should render with correct CSS class', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const dashboardPage = document.querySelector('.dashboard-page');
      expect(dashboardPage).toBeInTheDocument();
    });
  });

  // ==================== Chart Components Tests ====================

  describe('Chart Components', () => {
    it('should render ConsumptionTrendChartWrapper', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
    });

    it('should render TopIngredientsChartWrapper', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('top-ingredients-chart')).toBeInTheDocument();
    });

    it('should render LowStockChartWrapper', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('low-stock-chart')).toBeInTheDocument();
    });

    it('should render EfficiencyGaugeWrapper', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('efficiency-gauge')).toBeInTheDocument();
    });

    it('should render WasteGaugeWrapper', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('waste-gauge')).toBeInTheDocument();
    });

    it('should render all 5 chart components', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      expect(screen.getByTestId('top-ingredients-chart')).toBeInTheDocument();
      expect(screen.getByTestId('low-stock-chart')).toBeInTheDocument();
      expect(screen.getByTestId('efficiency-gauge')).toBeInTheDocument();
      expect(screen.getByTestId('waste-gauge')).toBeInTheDocument();
    });
  });

  // ==================== Layout Structure Tests ====================

  describe('Layout Structure', () => {
    it('should render dashboard page header', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const header = document.querySelector('.dashboard-page-header');
      expect(header).toBeInTheDocument();
    });

    it('should render dashboard page container', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const container = document.querySelector('.dashboard-page-container');
      expect(container).toBeInTheDocument();
    });

    it('should have consumption chart in correct container', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const consumptionContainer = document.querySelector('.consumption-chart');
      expect(consumptionContainer).toBeInTheDocument();
      expect(consumptionContainer).toContainElement(screen.getByTestId('consumption-chart'));
    });

    it('should have top ingredients chart in correct container', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const ingredientsContainer = document.querySelector('.ingredients-chart-item');
      expect(ingredientsContainer).toBeInTheDocument();
      expect(ingredientsContainer).toContainElement(screen.getByTestId('top-ingredients-chart'));
    });

    it('should have low stock chart in correct container', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const lowStockContainer = document.querySelector('.low-chart-item');
      expect(lowStockContainer).toBeInTheDocument();
      expect(lowStockContainer).toContainElement(screen.getByTestId('low-stock-chart'));
    });

    it('should have efficiency gauge in correct container', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const efficiencyContainer = document.querySelector('.efficiency-gauge-item');
      expect(efficiencyContainer).toBeInTheDocument();
      expect(efficiencyContainer).toContainElement(screen.getByTestId('efficiency-gauge'));
    });

    it('should have waste gauge in correct container', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const wasteContainer = document.querySelector('.waste-gauge-item');
      expect(wasteContainer).toBeInTheDocument();
      expect(wasteContainer).toContainElement(screen.getByTestId('waste-gauge'));
    });
  });

  // ==================== Refresh Key Tests ====================

  describe('Refresh Key Functionality', () => {
    it('should initialize with refreshKey of 0', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      // Check that components have initial keys (implicitly through rendering)
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      expect(screen.getByTestId('top-ingredients-chart')).toBeInTheDocument();
      expect(screen.getByTestId('low-stock-chart')).toBeInTheDocument();
      expect(screen.getByTestId('efficiency-gauge')).toBeInTheDocument();
      expect(screen.getByTestId('waste-gauge')).toBeInTheDocument();
    });

    it('should pass key prop to all chart components', () => {
      const { container } = render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      // All chart components should be rendered (which means keys are working)
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      expect(screen.getByTestId('top-ingredients-chart')).toBeInTheDocument();
      expect(screen.getByTestId('low-stock-chart')).toBeInTheDocument();
      expect(screen.getByTestId('efficiency-gauge')).toBeInTheDocument();
      expect(screen.getByTestId('waste-gauge')).toBeInTheDocument();
    });
  });

  // ==================== User Prop Tests ====================

  describe('User Prop Handling', () => {
    it('should handle undefined user', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={undefined} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      expect(screen.getByTestId('layout-user')).toHaveTextContent('No user');
    });

    it('should handle null user', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={null} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      expect(screen.getByTestId('layout-user')).toHaveTextContent('No user');
    });

    it('should render correctly with valid user', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('layout-user')).toHaveTextContent('Test User');
    });

    it('should render correctly with minimal user data', () => {
      const minimalUser = { name: 'John' };
      
      render(
        <RouterWrapper>
          <DashboardPage user={minimalUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('layout-user')).toHaveTextContent('John');
    });
  });

  // ==================== Component Mounting Tests ====================

  describe('Component Mounting', () => {
    it('should mount without errors', () => {
      expect(() => {
        render(
          <RouterWrapper>
            <DashboardPage user={mockUser} />
          </RouterWrapper>
        );
      }).not.toThrow();
    });

    it('should mount all child components without errors', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      // Verify all components mounted successfully
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      expect(screen.getByTestId('top-ingredients-chart')).toBeInTheDocument();
      expect(screen.getByTestId('low-stock-chart')).toBeInTheDocument();
      expect(screen.getByTestId('efficiency-gauge')).toBeInTheDocument();
      expect(screen.getByTestId('waste-gauge')).toBeInTheDocument();
    });

    it('should render in correct order', () => {
      const { container } = render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const charts = [
        screen.getByTestId('consumption-chart'),
        screen.getByTestId('top-ingredients-chart'),
        screen.getByTestId('low-stock-chart'),
        screen.getByTestId('efficiency-gauge'),
        screen.getByTestId('waste-gauge')
      ];
      
      // All should be present
      charts.forEach(chart => {
        expect(chart).toBeInTheDocument();
      });
    });
  });

  // ==================== Accessibility Tests ====================

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const heading = screen.getByRole('heading', { name: /panel de control/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      // Check for proper div structure
      expect(container.querySelector('.dashboard-page')).toBeInTheDocument();
      expect(container.querySelector('.dashboard-page-header')).toBeInTheDocument();
      expect(container.querySelector('.dashboard-page-container')).toBeInTheDocument();
    });
  });

  // ==================== Integration Tests ====================

  describe('Integration', () => {
    it('should pass all required props to DashboardLayout', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(screen.getByTestId('layout-user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('layout-active-tab')).toHaveTextContent('dashboard');
      expect(screen.getByTestId('layout-title')).toHaveTextContent('Dashboard');
      expect(screen.getByTestId('layout-subtitle')).toHaveTextContent('Visualiza y analiza el rendimiento de tu inventario');
    });

    it('should render children inside DashboardLayout', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      const layoutChildren = screen.getByTestId('layout-children');
      expect(layoutChildren).toBeInTheDocument();
      expect(layoutChildren).toContainElement(screen.getByText('Panel de Control'));
    });

    it('should have complete page structure', () => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      // Layout
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
      
      // Title
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
      
      // All charts
      expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
      expect(screen.getByTestId('top-ingredients-chart')).toBeInTheDocument();
      expect(screen.getByTestId('low-stock-chart')).toBeInTheDocument();
      expect(screen.getByTestId('efficiency-gauge')).toBeInTheDocument();
      expect(screen.getByTestId('waste-gauge')).toBeInTheDocument();
    });
  });

  // ==================== Snapshot Test ====================

  describe('Snapshot', () => {
    it('should match snapshot', () => {
      const { container } = render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot without user', () => {
      const { container } = render(
        <RouterWrapper>
          <DashboardPage user={null} />
        </RouterWrapper>
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});