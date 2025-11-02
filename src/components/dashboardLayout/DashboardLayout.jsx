import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import MainContent from '../mainContent/MainContent';
import './DashboardLayout.css';
import Logo from "../../assets/logoPositive.svg";

const DashboardLayout = ({ 
  children, 
  user, 
  activeTab = 'dashboard', 
  onTabChange,
  title,
  subtitle 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleTabChange = (tabId) => {
    if (onTabChange) onTabChange(tabId);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">

      {/* ✅ Header móvil */}
      <header className="mobile-header">
        <img src={Logo} alt="Logo" className="mobile-logo" />
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
