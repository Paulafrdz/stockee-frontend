import React from 'react';
import { TrendingUp, Package, AlertCircle } from 'lucide-react';
import './Preview.css';

const DashboardPreview = () => {
  return (
    <div className="preview-root">
  {/* Animated Background Orbs */}
  <div className="preview-orb preview-orb-1"></div>
  <div className="preview-orb preview-orb-2"></div>
  <div className="preview-orb preview-orb-3"></div>

  {/* Main Dashboard Card */}
  <div className="preview-container">
    <div className="preview-card">
      <div className="preview-card-top-bar">
        <div className="preview-logo-small">stockeo.</div>
        <div className="preview-nav-dots">
          <div className="preview-nav-dot"></div>
          <div className="preview-nav-dot preview-active"></div>
          <div className="preview-nav-dot"></div>
          <div className="preview-nav-dot"></div>
        </div>
      </div>

      <div className="preview-card-content">
        <div className="preview-header">
          <h3 className="preview-title">Inventario Stock</h3>
        </div>

        {/* Alert Banner */}
        <div className="preview-alert-banner">
          <AlertCircle size={16} color='var(--terciary-700)'/>
          <div className="preview-alert-content">
            <div className="preview-alert-title">7 artículos necesitan atención</div>
            <div className="preview-alert-subtext">3 críticos, 4 stock bajo</div>
          </div>
        </div>

        {/* Mini Table */}
        <div className="preview-mini-table">
          <div className="preview-table-header">
            <span className="preview-table-header-cell">Ingredientes</span>
            <span className="preview-table-header-cell">Stock</span>
            <span className="preview-table-header-cell">Estado</span>
          </div>

          <div className="preview-table-row">
            <span className="preview-table-cell">Tomates</span>
            <span className="preview-table-cell preview-stock-critical">2.5 kg</span>
            <span className="preview-status-badge preview-status-critical">Crítico</span>
          </div>
          <div className="preview-table-row">
            <span className="preview-table-cell">Mozzarella</span>
            <span className="preview-table-cell preview-stock-ok">4.2 kg</span>
            <span className="preview-status-badge preview-status-ok">Ok</span>
          </div>
          <div className="preview-table-row">
            <span className="preview-table-cell">Aceite oliva</span>
            <span className="preview-table-cell preview-stock-low">1.2 L</span>
            <span className="preview-status-badge preview-status-low">Bajo</span>
          </div>
        </div>
      </div>
    </div>

    {/* Floating Stats Cards */}
    <div className="preview-floating-card preview-floating-card-1">
      <div className="preview-stat-mini">
        <TrendingUp size={16} className="preview-stat-icon preview-stat-icon-green" />
        <div className="preview-stat-value">+15%</div>
        <div className="preview-stat-label">Ventas</div>
      </div>
    </div>

    <div className="preview-floating-card preview-floating-card-2">
      <div className="preview-stat-mini">
        <Package size={16} className="preview-stat-icon preview-stat-icon-red" />
        <div className="preview-stat-value">7</div>
        <div className="preview-stat-label">Alertas</div>
      </div>
    </div>
  </div>

  {/* Feature Pills */}
  <div className="preview-feature-pills">
    <div className="preview-pill">Control de Inventario</div>
    <div className="preview-pill">Gestión de Ventas</div>
    <div className="preview-pill">Analytics en Tiempo Real</div>
    <div className="preview-pill">Recetas y Costos</div>
  </div>
</div>

  );
};

export default DashboardPreview;