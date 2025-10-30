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

describe('DashboardPage', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Rendering ====================

  it('should render DashboardLayout with correct props', () => {
    render(
      <RouterWrapper>
        <DashboardPage user={mockUser} />
      </RouterWrapper>
    );
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('layout-user')).toHaveTextContent('Test User');
    expect(screen.getByTestId('layout-active-tab')).toHaveTextContent('dashboard');
    expect(screen.getByTestId('layout-title')).toHaveTextContent('Dashboard');
    expect(screen.getByTestId('layout-subtitle')).toHaveTextContent('Visualiza y analiza el rendimiento de tu inventario');
  });

  it('should render page title', () => {
    render(
      <RouterWrapper>
        <DashboardPage user={mockUser} />
      </RouterWrapper>
    );
    
    const heading = screen.getByRole('heading', { name: /panel de control/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  // ==================== Chart Components ====================

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

  it('should render charts in correct containers', () => {
    render(
      <RouterWrapper>
        <DashboardPage user={mockUser} />
      </RouterWrapper>
    );
    
    expect(document.querySelector('.consumption-chart')).toContainElement(
      screen.getByTestId('consumption-chart')
    );
    expect(document.querySelector('.ingredients-chart-item')).toContainElement(
      screen.getByTestId('top-ingredients-chart')
    );
    expect(document.querySelector('.low-chart-item')).toContainElement(
      screen.getByTestId('low-stock-chart')
    );
  });

  // ==================== User Prop Handling ====================

  it('should handle null or undefined user', () => {
    render(
      <RouterWrapper>
        <DashboardPage user={null} />
      </RouterWrapper>
    );
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('layout-user')).toHaveTextContent('No user');
  });

  // ==================== Layout Structure ====================

  it('should have complete page structure', () => {
    render(
      <RouterWrapper>
        <DashboardPage user={mockUser} />
      </RouterWrapper>
    );
    
    expect(document.querySelector('.dashboard-page')).toBeInTheDocument();
    expect(document.querySelector('.dashboard-page-header')).toBeInTheDocument();
    expect(document.querySelector('.dashboard-page-container')).toBeInTheDocument();
  });

  it('should mount without errors', () => {
    expect(() => {
      render(
        <RouterWrapper>
          <DashboardPage user={mockUser} />
        </RouterWrapper>
      );
    }).not.toThrow();
  });
});