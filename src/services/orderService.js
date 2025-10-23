import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get recommended orders based on current stock
export const getRecommendedOrders = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    
    // Transform data to match frontend format
    return response.data.map(item => ({
      id: item.id,
      name: item.name,
      currentStock: parseFloat(item.currentStock),
      minimumStock: parseFloat(item.minimumStock),
      recommendedQuantity: parseFloat(item.recommendedQuantity || 0),
      weeklyUsage: parseFloat(item.weeklyUsage),
      unit: item.unit,
      priority: item.priority || 'medium',
      lastOrderDate: item.lastOrderDate,
    }));
  } catch (error) {
    console.error('Error fetching recommended orders:', error);
    return []; // Return empty array on error
  }
};

// Submit a new order
export const submitOrder = async (orderData) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        items: orderData.items, // Only what backend expects
      },
      getAuthHeaders()
    );
    
    return {
      success: true,
      orderId: response.data?.id || `order_${Date.now()}`,
      items: orderData.items,
      itemCount: orderData.items.length
    };
  } catch (error) {
    console.error('❌ Error submitting order:', error);
    throw error; // Let frontend handle the error
  }
};

// Get order history
export const getOrderHistory = async (limit = 50) => {
  try {
    const response = await axios.get(
      `${API_URL}/history?limit=${limit}`,
      getAuthHeaders()
    );
    
    return response.data.map(order => ({
      id: order.id,
      date: order.orderDate,
      items: order.items || [],
      itemCount: order.itemCount,
    }));
  } catch (error) {
    console.error('Error fetching order history:', error);
    return [];
  }
};