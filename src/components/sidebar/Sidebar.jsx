import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, ShoppingCart, ChefHat, Package, Settings, LogOut, NotebookPen, Gauge, Menu, X } from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import './Sidebar.css';
import Logo from "../../assets/logoPositive.svg";

const Sidebar = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    //mobile menu
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const handleBackdropClick = () => {
        setIsSidebarOpen(false);
    };

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // block scroll
    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* boton hamburguesa */}
            <button 
                className="sidebar-toggle" 
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                <Menu size={24} />
            </button>

            <div 
                className={`sidebar-backdrop ${isSidebarOpen ? 'active' : ''}`}
                onClick={handleBackdropClick}
            />

            {/* SIDEBAR */}
            <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <button 
                    className="sidebar-close" 
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                >
                    <X size={24} />
                </button>

                {/* Logo */}
                <div className="sidebar-header">
                    <Link to="/dashboard" onClick={handleNavClick}> 
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
                                onClick={handleNavClick} 
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
        </>
    );
};

export default Sidebar;