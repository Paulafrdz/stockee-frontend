import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, ShoppingCart, ChefHat, Package, Settings, LogOut } from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import './Sidebar.css';
import Logo from "../../assets/logoPositive.svg";

const Sidebar = ({ activeTab = 'dashboard', onTabChange, user }) => {
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: BarChart3
        },
        {
            id: 'sales',
            label: 'Ventas',
            icon: ShoppingCart
        },
        {
            id: 'dishes',
            label: 'Platos',
            icon: ChefHat
        },
        {
            id: 'stock',
            label: 'Stock',
            icon: Package,
        }
    ];

    const handleTabClick = (tabId) => {
        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    const handleLogout = async () => {
        try {
      const success = await AuthService.logout();

      if (success) {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate("/login", { replace: true }); 
    }
  };


    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <Link to="/home">
                    <img src={Logo} alt="logotype" className="logo"></img>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                            onClick={() => handleTabClick(item.id)}
                        >
                            <Icon className="nav-icon" size={20} />
                            <span className="nav-label">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        <span className="avatar-text">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="user-details">
                        <div className="user-name">{user?.username || 'Usuario'}</div>
                    </div>
                </div>

                {/* Settings and Logout */}
                <div className="sidebar-actions">
                    <button className="action-button" title="Configuración">
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                    <button
                        className="action-button logout-button"
                        onClick={handleLogout}
                        title="Cerrar sesión"
                    >
                        <LogOut size={18} />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;