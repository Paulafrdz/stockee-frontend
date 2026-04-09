import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import FloatingButton from '../components/floatingButton/FloatingButton';
import AddSaleModal from '../components/addSaleModal/AddSaleModal';
import SalesTable from '../components/salesTable/SalesTable';
import { getAllSales, createSale, deleteSale } from '../services/saleService';
import { getAllDishes } from '../services/dishService';
import SaleHistory from '../components/saleHistory/SaleHistory';
import StockFilters from '../components/stockFilters/StockFilters';
import './SalePage.css';


const SalePage = ({ user }) => {
    const [sales, setSales] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('today');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [salesData, dishesData] = await Promise.all([
                getAllSales(),
                getAllDishes(),
            ]);
            setSales(salesData);
            setDishes(dishesData);
        } catch (error) {
            console.error('❌ Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSale = async (saleData) => {
        try {
            const saved = await createSale({
                lines: [{
                    dishId: saleData.dishId,
                    quantity: saleData.quantity,
                }]
            });
            setSales(prev => [...prev, saved]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('❌ Error creating sale:', error);
            throw error;
        }
    };

    const handleDelete = async (saleId) => {
        try {
            await deleteSale(saleId);
            setSales(prev => prev.filter(s => s.id !== saleId));
        } catch (error) {
            console.log('❌ Error deleting sale:', error);
        }
    };

    return (
        <DashboardLayout
            user={user}
            activeTab="ventas"
            title="Ventas"
            subtitle="Gestiona las ventas de tu restaurante"
        >
            <div className="sales-page">
                <div className="sales-page-header">
                    <h1 className="sales-page-title">Ventas</h1>
                </div>

                {/* Tabs */}
                <div className="tabs-search">
                <div className="st-tabs">
                    <button
                        className={`st-tab ${activeTab === 'today' ? 'st-tab--active' : ''}`}
                        onClick={() => setActiveTab('today')}
                    >
                        Hoy
                    </button>
                    <button
                        className={`st-tab ${activeTab === 'history' ? 'st-tab--active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Historial
                    </button>
                </div>
                <StockFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    showFilters={false}
                    searchPlaceholder="Buscar por plato..."
                />
                </div>
                {isLoading ? (
                    <div className="sales-page-loading">Cargando ventas...</div>
                ) : activeTab === 'today' ? (
                    <SalesTable
                        sales={sales}
                        onDelete={handleDelete}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                ) : (
                    <SaleHistory sales={sales} />
                )}
            </div>

            <FloatingButton
                icon={Plus}
                variant="primary"
                size="small"
                tooltip="Nueva venta"
                onClick={() => setIsModalOpen(true)}
            />

            <AddSaleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateSale}
                dishes={dishes}
            />
        </DashboardLayout>
    );
};

export default SalePage;