import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import MainContent from '../mainContent/MainContent';
import './DashboardLayout.css';
import LogoLight from "../../assets/logoPositive.svg";
import LogoDark from "../../assets/logoNegative.svg";
import useOnboarding from '../../hooks/useOnboarding';


const DashboardLayout = ({
  children,
  activeTab = 'dashboard',
  onTabChange,
  title,
  subtitle
}) => {
  useOnboarding();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const handleTabChange = (tabId) => {
    if (onTabChange) onTabChange(tabId);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">

      {/* ✅ Header móvil */}
      <header className="mobile-header">
        <img src={theme === 'dark' ? LogoDark : LogoLight} alt="Logo" className="mobile-logo" />
      </header>

      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          user={user}
        />
      </div>

      {/* Main Content */}
      <MainContent title={title} subtitle={subtitle}>
        {children}
      </MainContent>
    </div>
  );
};

export default DashboardLayout;
