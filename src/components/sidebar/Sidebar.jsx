import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, ShoppingCart, ChefHat, Package, Settings, LogOut, NotebookPen, Gauge } from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import './Sidebar.css';
import Logo from "../../assets/logoPositive.svg";

const Sidebar = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
        { id: 'sales', label: 'Ventas', icon: ShoppingCart, path: '/sales' },
        { id: 'dishes', label: 'Platos', icon: ChefHat, path: '/dishes' },
        { id: 'stock', label: 'Stock', icon: Package, path: '/stock' },
        { id: 'order', label: 'Pedido', icon: NotebookPen, path: '/order' },
        { id: 'analytics', label: 'Eficiencia', icon: Gauge, path: '/analytics' },
    ];

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Error during logout:", error);
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <Link to="/dashboard">
                    <img src={Logo} alt="logotype" className="logo" />
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                        >
                            <Icon className="nav-icon" size={20} />
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        <span className="avatar-text">{user?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
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
