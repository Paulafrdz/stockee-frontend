import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import OrderTabs from '../components/orderTabs/OrderTabs';
import RecommendedOrdersTable from '../components/orderTable/OrderTable';
import OrderHistory from '../components/orderHistory/OrderHistory';
import Button from '../components/button/Button';
import './OrdersPage.css';

import {
    getRecommendedOrders,
    submitOrder,
    getOrderHistory
} from '../services/orderService';

const OrdersPage = () => {
    const [activeTab, setActiveTab] = useState('recommendations');
    const [recommendedOrders, setRecommendedOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingOrder, setSubmittingOrder] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [recommendedData, historyData] = await Promise.all([
                    getRecommendedOrders(),
                    getOrderHistory(), 
                ]);

                // ✅ FILTER OUT ITEMS THAT DON'T NEED ORDERING
                const itemsToOrder = recommendedData.filter(item => item.recommendedQuantity > 0);
                
                setRecommendedOrders(itemsToOrder);
                setOrderHistory(historyData);

            } catch (error) {
                console.error("Error fetching orders data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTabChange = (tabId) => setActiveTab(tabId);

    const handleSubmitOrder = async (orderData) => {
        setSubmittingOrder(true);
        try {
            const submittedOrder = await submitOrder(orderData);

            // ✅ UPDATE LOCAL STATE - Remove ordered items from recommendations
            const updatedRecommendations = recommendedOrders.filter(item => 
                !orderData.items.find(o => o.id === item.id)
            );

            setRecommendedOrders(updatedRecommendations);
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
        // ✅ Check if there are actually items to order
        const itemsToOrder = recommendedOrders.filter(item => item.recommendedQuantity > 0);
        
        if (itemsToOrder.length === 0) {
            console.log("No items to order");
            return;
        }

        try {
            setSubmittingOrder(true);

            // 🧾 Create order with recommended ingredients
            const orderData = {
                items: itemsToOrder.map(item => ({
                    id: item.id,
                    recommendedQuantity: item.recommendedQuantity,
                    unit: item.unit,
                })),
            };

            const submittedOrder = await submitOrder(orderData);
            console.log("✅ Order submitted:", submittedOrder);

            setRecommendedOrders(prev => 
            prev.filter(item => item.recommendedQuantity === 0)
        );

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
        setRecommendedOrders(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, recommendedQuantity: Math.max(0, newQuantity) }
                    : item
            )
        );
    };

    const handleGlobalQuantityAdjustment = (factor) => {
        setRecommendedOrders(prev =>
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
        setRecommendedOrders([]);
    };

    const handleDeleteItem = (itemId) => {
        setRecommendedOrders(prev => prev.filter(item => item.id !== itemId));
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
                        onDeleteItem={handleDeleteItem} // ✅ Add delete handler
                        isSubmitting={submittingOrder}
                    />
                );
            case 'history':
                return <OrderHistory orderHistory={orderHistory} />;
            default:
                return null;
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
        <DashboardLayout
            activeTab="orders"
            title="Pedidos"
        >
            <div className="orders-page">
                {/* Header superior similar a StockPage */}
                <div className="orders-header">
                    <div className="orders-header-info">
                        <h2 className="orders-title">Gestión de pedidos</h2>
                        <p className="orders-subtitle">
                            {recommendedOrders.length} ingredientes para ordenar
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

                {/* Tabs de navegación */}
                <OrderTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Contenido de pestañas */}
                <div className="orders-content">{renderTabContent()}</div>
            </div>
        </DashboardLayout>
    );
};

export default OrdersPage;