import React from 'react';
import { TrendingUp, Package, AlertCircle } from 'lucide-react';
import './Preview.css';

const DashboardPreview = () => {
  return (
    <div className="dashboard-preview">
      {/* Animated Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Main Dashboard Card */}
      <div className="preview-container">
        <div className="dashboard-card">
          <div className="card-top-bar">
            <div className="logo-small">stockeo.</div>
            <div className="nav-dots">
              <div className="nav-dot"></div>
              <div className="nav-dot active"></div>
              <div className="nav-dot"></div>
              <div className="nav-dot"></div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-header">
              <h3 className="dashboard-title">Inventario Stock</h3>
            </div>

            {/* Alert Banner */}
            <div className="alert-banner">
              <AlertCircle size={16} color='var(--terciary-700)'/>
              <div className="alert-content">
                <div className="alert-title">7 artículos necesitan atención</div>
                <div className="alert-subtext">3 críticos, 4 stock bajo</div>
              </div>
            </div>

            {/* Mini Table */}
            <div className="mini-table">
              <div className="table-header">
                <span className="table-header-cell">Ingredientes</span>
                <span className="table-header-cell">Stock</span>
                <span className="table-header-cell">Estado</span>
              </div>
              <div className="table-row">
                <span className="table-cell">Tomates</span>
                <span className="table-cell stock-critical">2.5 kg</span>
                <span className="status-badge status-critical">Crítico</span>
              </div>
              <div className="table-row">
                <span className="table-cell">Mozzarella</span>
                <span className="table-cell stock-ok">4.2 kg</span>
                <span className="status-badge status-ok">Ok</span>
              </div>
              <div className="table-row">
                <span className="table-cell">Aceite oliva</span>
                <span className="table-cell stock-low">1.2 L</span>
                <span className="status-badge status-low">Bajo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="floating-card floating-card-1">
          <div className="stat-mini">
            <TrendingUp size={16} className="stat-icon stat-icon-green" />
            <div className="stat-value">+15%</div>
            <div className="stat-label">Ventas</div>
          </div>
        </div>

        <div className="floating-card floating-card-2">
          <div className="stat-mini">
            <Package size={16} className="stat-icon stat-icon-red" />
            <div className="stat-value">7</div>
            <div className="stat-label">Alertas</div>
          </div>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="feature-pills">
        <div className="pill">Control de Inventario</div>
        <div className="pill">Gestión de Ventas</div>
        <div className="pill">Analytics en Tiempo Real</div>
        <div className="pill">Recetas y Costos</div>
      </div>
    </div>
  );
};

export default DashboardPreview;