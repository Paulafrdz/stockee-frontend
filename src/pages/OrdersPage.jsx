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
    getOrderHistory,

    getOrderStats
} from '../services/orderService';

const OrdersPage = () => {
    const [activeTab, setActiveTab] = useState('recommendations');
    const [recommendedOrders, setRecommendedOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [orderStats, setOrderStats] = useState({
        pendingOrders: 0,
        nextOrderDate: null,
        urgentIngredients: 0
    });
    const [loading, setLoading] = useState(true);
    const [submittingOrder, setSubmittingOrder] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [recommendedData, historyData, statsData] = await Promise.all([
                    getRecommendedOrders(),
                    getOrderHistory(),
                    getOrderStats()
                ]);
                setRecommendedOrders(recommendedData);
                setOrderHistory(historyData);
                setOrderStats(statsData);
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

            const updatedRecommendations = recommendedOrders.map(item => {
                const orderedItem = orderData.items.find(o => o.id === item.id);
                if (orderedItem) {
                    return {
                        ...item,
                        currentStock: item.currentStock + orderedItem.recommendedQuantity,
                        recommendedQuantity: 0,
                        lastOrderDate: new Date().toISOString()
                    };
                }
                return item;
            });

            setRecommendedOrders(updatedRecommendations);
            setOrderHistory(prev => [submittedOrder, ...prev]);

            setOrderStats(prev => ({
                ...prev,
                pendingOrders: prev.pendingOrders + 1,
                urgentIngredients: Math.max(
                    0,
                    prev.urgentIngredients -
                    orderData.items.filter(i => i.priority === 'high').length
                )
            }));

            return submittedOrder;
        } catch (error) {
            console.error("Error submitting order:", error);
            throw error;
        } finally {
            setSubmittingOrder(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (recommendedOrders.length === 0) return;

        try {
            setSubmittingOrder(true);

            // 🧾 Crear el pedido con los ingredientes recomendados
            const orderData = {
                items: recommendedOrders
                    .filter(item => item.recommendedQuantity > 0)
                    .map(item => ({
                        id: item.id,
                        name: item.name,
                        recommendedQuantity: item.recommendedQuantity,
                        unit: item.unit,
                    })),
            };

            const submittedOrder = await submitOrder(orderData);

            console.log("✅ Pedido realizado:", submittedOrder);

            // 🧹 Vaciar tabla de pedidos recomendados
            setRecommendedOrders(prev =>
                prev.map(item => ({ ...item, recommendedQuantity: 0 }))
            );

            // ♻️ Actualizar historial y estadísticas
            const [updatedHistory, updatedStats] = await Promise.all([
                getOrderHistory(),
                getOrderStats(),
            ]);
            setOrderHistory(updatedHistory);
            setOrderStats(updatedStats);

            // 🔄 Notificar a la tabla de stock que se actualice (opcional)
            localStorage.setItem('refreshStock', Date.now());

        } catch (error) {
            console.error("Error al realizar pedido:", error);
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
        setRecommendedOrders(prev =>
            prev.map(item => ({ ...item, recommendedQuantity: 0 }))
        );
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

                    </div>
                    <div className="orders-header-actions">
                        <Button
                            label="Realizar pedido"
                            icon="shopping-cart"
                            onClick={handleCompleteOrder}
                            disabled={submittingOrder || recommendedOrders.length === 0}
                        > Realizar pedido
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
