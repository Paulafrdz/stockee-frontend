import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import OrderTabs from '../components/orderTabs/OrderTabs';
import RecommendedOrdersTable from '../components/orderTable/OrderTable';
import OrderHistory from '../components/orderHistory/OrderHistory';
import Button from '../components/button/Button';
import './OrdersPage.css';
import { getStockItems } from '../services/stockService';
import {
    getRecommendedOrders,
    submitOrder,
    getOrderHistory
} from '../services/orderService';
import FloatingButton from '../components/floatingButton/FloatingButton';
import { Plus } from 'lucide-react';
import AddOrderModal from '../components/addOrderModal/AddOrderModal';


const OrdersPage = () => {
    const [activeTab, setActiveTab] = useState('recommendations');
    const [autoRecommendedOrders, setAutoRecommendedOrders] = useState([]);
    const [manualOrders, setManualOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingOrder, setSubmittingOrder] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stockIngredients, setStockIngredients] = useState([]);



    const recommendedOrders = [...autoRecommendedOrders, ...manualOrders];

    // ✅ SIMPLER FIX: Load manual items FIRST, then fetch backend data (runs only once)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('🔄 Starting data fetch...');

                // ✅ Load manual items FIRST from localStorage
                const savedManualOrders = localStorage.getItem('manualOrders');
                if (savedManualOrders) {
                    const manualItems = JSON.parse(savedManualOrders);
                    console.log('📂 Initial load of manual items:', manualItems);
                    setManualOrders(manualItems);
                }

                // ✅ Then fetch backend data
                const [recommendedData, historyData] = await Promise.all([
                    getRecommendedOrders(),
                    getOrderHistory(),
                ]);

                console.log('📥 Received auto-recommended data:', recommendedData);

                // ✅ ONLY set auto-recommended, NEVER touch manual orders
                const autoRecommended = recommendedData.filter(item => item.recommendedQuantity > 0);
                console.log('✅ Setting autoRecommendedOrders:', autoRecommended);
                setAutoRecommendedOrders(autoRecommended);

                setOrderHistory(historyData);

            } catch (error) {
                console.error("Error fetching orders data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array - runs only once

    // ✅ FETCH STOCK INGREDIENTS
    useEffect(() => {
        const fetchStockIngredients = async () => {
            try {
                const stockData = await getStockItems();
                console.log('Stock data from DB:', stockData);
                setStockIngredients(stockData);
            } catch (error) {
                console.error('Error fetching stock ingredients:', error);
            }
        };
        fetchStockIngredients();
    }, []);

    // ✅ SAVE MANUAL ITEMS TO LOCALSTORAGE (when they change)
    useEffect(() => {
        if (manualOrders.length > 0) {
            localStorage.setItem('manualOrders', JSON.stringify(manualOrders));
            console.log('💾 Saved MANUAL items to localStorage:', manualOrders);
        } else {
            localStorage.removeItem('manualOrders');
            console.log('🗑️ Cleared manual items from localStorage');
        }
    }, [manualOrders]);

    const handleTabChange = (tabId) => setActiveTab(tabId);

    const handleSubmitOrder = async (orderData) => {
        setSubmittingOrder(true);
        try {
            const submittedOrder = await submitOrder(orderData);

            // ✅ Remove ordered items from BOTH auto and manual
            setAutoRecommendedOrders(prev =>
                prev.filter(item => !orderData.items.find(o => o.id === item.id))
            );
            setManualOrders(prev =>
                prev.filter(item => !orderData.items.find(o => o.id === item.id))
            );

            setOrderHistory(prev => [submittedOrder, ...prev]);
            return submittedOrder;
        } catch (error) {
            console.error("Error submitting order:", error);
            throw error;
        } finally {
            setSubmittingOrder(false);
        }
    };

    const handleCompleteOrder = async () => {
        // ✅ Include BOTH auto and manual items in the order
        const itemsToOrder = recommendedOrders.filter(item => item.recommendedQuantity > 0);

        if (itemsToOrder.length === 0) {
            console.log("No items to order");
            return;
        }

        try {
            setSubmittingOrder(true);

            const orderData = {
                items: itemsToOrder.map(item => ({
                    id: item.id,
                    recommendedQuantity: item.recommendedQuantity,
                    unit: item.unit,
                })),
            };

            const submittedOrder = await submitOrder(orderData);
            console.log("✅ Order submitted:", submittedOrder);

            // ✅ Only clear auto-recommended items, KEEP manual items
            setAutoRecommendedOrders([]);
            // Manual items stay in the table until YOU remove them!

            const updatedHistory = await getOrderHistory();
            setOrderHistory(updatedHistory);

            localStorage.setItem('refreshStock', Date.now());

        } catch (error) {
            console.error("Error submitting order:", error);
        } finally {
            setSubmittingOrder(false);
        }
    };

    const handleQuantityAdjustment = (itemId, newQuantity) => {
        // Check if it's a manual item
        const isManualItem = manualOrders.some(item => item.id === itemId);

        if (isManualItem) {
            setManualOrders(prev =>
                prev.map(item =>
                    item.id === itemId
                        ? { ...item, recommendedQuantity: Math.max(0, newQuantity) }
                        : item
                )
            );
        } else {
            setAutoRecommendedOrders(prev =>
                prev.map(item =>
                    item.id === itemId
                        ? { ...item, recommendedQuantity: Math.max(0, newQuantity) }
                        : item
                )
            );
        }
    };

    const handleGlobalQuantityAdjustment = (factor) => {
        setAutoRecommendedOrders(prev =>
            prev.map(item => ({
                ...item,
                recommendedQuantity: Math.max(
                    0,
                    Math.round(item.recommendedQuantity * factor * 10) / 10
                )
            }))
        );
        setManualOrders(prev =>
            prev.map(item => ({
                ...item,
                recommendedQuantity: Math.max(
                    0,
                    Math.round(item.recommendedQuantity * factor * 10) / 10
                )
            }))
        );
    };

    const handleClearAll = () => {
        setAutoRecommendedOrders([]);
    };

    const handleDeleteItem = (itemId) => {
        // ✅ Check if it's a manual item or auto-recommended
        const isManualItem = manualOrders.some(item => item.id === itemId);

        if (isManualItem) {
            // Remove from manual orders (persistent)
            setManualOrders(prev => prev.filter(item => item.id !== itemId));
        } else {
            // Remove from auto-recommended (temporary)
            setAutoRecommendedOrders(prev => prev.filter(item => item.id !== itemId));
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'recommendations':
                return (
                    <RecommendedOrdersTable
                        recommendedOrders={recommendedOrders}
                        onQuantityChange={handleQuantityAdjustment}
                        onGlobalAdjustment={handleGlobalQuantityAdjustment}
                        onSubmitOrder={handleSubmitOrder}
                        onClearAll={handleClearAll}
                        onDeleteItem={handleDeleteItem}
                        isSubmitting={submittingOrder}
                    />
                );
            case 'history':
                return <OrderHistory orderHistory={orderHistory} />;
            default:
                return null;
        }
    };

    const handleAddIngredient = async (ingredientData) => {
        try {
            console.log('📦 Adding ingredient to order:', ingredientData);

            const newManualItem = {
                id: ingredientData.ingredientId,
                name: ingredientData.ingredientName,
                currentStock: ingredientData.currentStock,
                minimumStock: 0,
                recommendedQuantity: ingredientData.quantity,
                unit: ingredientData.unit,
                weeklyUsage: 0,
                priority: 'manual',
                isManual: true,
                lastOrderDate: null
            }

            // ✅ Add to manual orders (separate from auto-recommended)
            setManualOrders(prev => [...prev, newManualItem]);

            console.log('✅ Manual ingredient added successfully');

        } catch (error) {
            console.error('❌ Error:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <DashboardLayout activeTab="orders" title="Pedidos">
                <div className="orders-page">
                    <div className="orders-loading">
                        <div className="orders-loading-spinner"></div>
                        <p className="orders-loading-text">Cargando pedidos y sugerencias...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeTab="orders" title="Pedidos">
            <div className="orders-page">
                <div className="orders-header">
                    <div className="orders-header-info">
                        <h2 className="orders-title">Gestión de pedidos</h2>
                        <p className="orders-subtitle">
                            {recommendedOrders.length} ingredientes para el pedido
                        </p>
                    </div>
                    <div className="orders-header-actions">
                        <Button
                            icon="shopping-cart"
                            onClick={handleCompleteOrder}
                            disabled={submittingOrder || recommendedOrders.length === 0}
                        >
                            Realizar pedido ({recommendedOrders.length})
                        </Button>
                    </div>
                </div>

                <OrderTabs activeTab={activeTab} onTabChange={handleTabChange} />
                <div className="orders-content">{renderTabContent()}</div>

                <FloatingButton
                    icon={Plus}
                    variant="primary"
                    size="small"
                    position="bottom-right"
                    tooltip="Añadir ingrediente a la orden"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            <AddOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddIngredient}
                availableIngredients={stockIngredients}
                existingOrderItems={recommendedOrders}
            />
           
        </DashboardLayout>
    );
};

export default OrdersPage;