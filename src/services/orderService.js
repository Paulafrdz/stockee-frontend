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

// Get recommended orders based on current stock and usage patterns
export const getRecommendedOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/recommendations`, getAuthHeaders());
    
    // Transform data to match frontend format
    return response.data.map(item => ({
      id: item.id,
      name: item.name,
      currentStock: parseFloat(item.currentStock),
      minimumStock: parseFloat(item.minimumStock),
      recommendedQuantity: parseFloat(item.recommendedQuantity || 0),
      weeklyUsage: parseFloat(item.weeklyUsage),
      unit: item.unit,
      unitPrice: parseFloat(item.unitPrice),
      priority: item.priority || 'medium', // 'high', 'medium', 'low'
      lastOrderDate: item.lastOrderDate,
      supplier: item.supplier
    }));
  } catch (error) {
    console.error('Error fetching recommended orders:', error);
    
    // Return mock data for development/fallback
    return [
      {
        id: 1,
        name: 'Tomatoes',
        currentStock: 2.5,
        minimumStock: 5,
        recommendedQuantity: 10,
        weeklyUsage: 3.5,
        unit: 'Kg',
        unitPrice: 2.50,
        priority: 'high',
        lastOrderDate: null,
        supplier: 'Fresh Produce Co.'
      },
      {
        id: 2,
        name: 'Mozzarella',
        currentStock: 4,
        minimumStock: 3,
        recommendedQuantity: 15,
        weeklyUsage: 8,
        unit: 'Kg',
        unitPrice: 12.50,
        priority: 'medium',
        lastOrderDate: null,
        supplier: 'Dairy Suppliers Ltd.'
      },
      {
        id: 3,
        name: 'Olive Oil',
        currentStock: 1.2,
        minimumStock: 2,
        recommendedQuantity: 8,
        weeklyUsage: 1.5,
        unit: 'L',
        unitPrice: 8.90,
        priority: 'high',
        lastOrderDate: null,
        supplier: 'Mediterranean Imports'
      },
      {
        id: 4,
        name: 'Flour',
        currentStock: 8,
        minimumStock: 5,
        recommendedQuantity: 20,
        weeklyUsage: 12,
        unit: 'Kg',
        unitPrice: 1.20,
        priority: 'low',
        lastOrderDate: null,
        supplier: 'Grain Masters'
      },
      {
        id: 5,
        name: 'Onions',
        currentStock: 3,
        minimumStock: 4,
        recommendedQuantity: 8,
        weeklyUsage: 2.5,
        unit: 'Kg',
        unitPrice: 1.80,
        priority: 'medium',
        lastOrderDate: null,
        supplier: 'Local Farms'
      }
    ];
  }
};

// Submit a new order
export const submitOrder = async (orderData) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        items: orderData.items,
        totals: orderData.totals,
        orderDate: orderData.timestamp || new Date().toISOString(),
        status: 'pending'
      },
      getAuthHeaders()
    );
    
    return {
      id: response.data.id,
      date: response.data.orderDate,
      status: response.data.status || 'pending',
      items: orderData.items,
      itemCount: orderData.items.length,
      total: orderData.totals.total,
      subtotal: orderData.totals.subtotal,
      discount: orderData.totals.discount,
      shippingCost: orderData.totals.shippingCost
    };
  } catch (error) {
    console.error('❌ Error submitting order:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Return mock success response for development
    return {
      id: `order_${Date.now()}`,
      date: orderData.timestamp || new Date().toISOString(),
      status: 'pending',
      items: orderData.items,
      itemCount: orderData.items.length,
      total: orderData.totals.total,
      subtotal: orderData.totals.subtotal,
      discount: orderData.totals.discount,
      shippingCost: orderData.totals.shippingCost
    };
  }
};

// Get order history
export const getOrderHistory = async (limit = 50, offset = 0) => {
  try {
    const response = await axios.get(
      `${API_URL}/history?limit=${limit}&offset=${offset}`,
      getAuthHeaders()
    );
    
    return response.data.map(order => ({
      id: order.id,
      date: order.orderDate,
      status: order.status,
      items: order.items || [],
      itemCount: order.itemCount,
      total: parseFloat(order.total),
      deliveryDate: order.deliveryDate
    }));
  } catch (error) {
    console.error('Error fetching order history:', error);
    
    // Return mock data for development
    return [
      {
        id: 'ORD-2025-001',
        date: '2025-10-15T10:30:00Z',
        status: 'delivered',
        items: [
          { name: 'Tomatoes', quantity: 5, unit: 'Kg', unitPrice: 2.50, totalPrice: 12.50 },
          { name: 'Mozzarella', quantity: 3, unit: 'Kg', unitPrice: 12.50, totalPrice: 37.50 },
          { name: 'Basil', quantity: 0.5, unit: 'Kg', unitPrice: 15.00, totalPrice: 7.50 }
        ],
        itemCount: 3,
        total: 57.50,
        deliveryDate: '2025-10-16T09:00:00Z'
      },
      {
        id: 'ORD-2025-002',
        date: '2025-10-08T14:20:00Z',
        status: 'delivered',
        items: [
          { name: 'Flour', quantity: 20, unit: 'Kg', unitPrice: 1.20, totalPrice: 24.00 },
          { name: 'Olive Oil', quantity: 5, unit: 'L', unitPrice: 8.90, totalPrice: 44.50 }
        ],
        itemCount: 2,
        total: 68.50,
        deliveryDate: '2025-10-09T11:30:00Z'
      },
      {
        id: 'ORD-2025-003',
        date: '2025-10-01T09:15:00Z',
        status: 'processing',
        items: [
          { name: 'Onions', quantity: 10, unit: 'Kg', unitPrice: 1.80, totalPrice: 18.00 },
          { name: 'Garlic', quantity: 2, unit: 'Kg', unitPrice: 6.50, totalPrice: 13.00 }
        ],
        itemCount: 2,
        total: 31.00,
        deliveryDate: null
      }
    ];
  }
};

// Get order statistics
export const getOrderStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`, getAuthHeaders());
    
    return {
      pendingOrders: response.data.pendingOrders || 0,
      nextOrderDate: response.data.nextOrderDate,
      monthlySavings: parseFloat(response.data.monthlySavings || 0),
      urgentIngredients: response.data.urgentIngredients || 0
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    
    // Return mock data for development
    return {
      pendingOrders: 2,
      nextOrderDate: '2025-10-25T10:00:00Z',
      monthlySavings: 145.30,
      urgentIngredients: 3
    };
  }
};

// Get scheduled orders
export const getScheduledOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/scheduled`, getAuthHeaders());
    
    return response.data.map(schedule => ({
      id: schedule.id,
      name: schedule.name,
      frequency: schedule.frequency,
      nextDelivery: schedule.nextDelivery,
      isActive: schedule.isActive,
      items: schedule.items || [],
      totalAmount: parseFloat(schedule.totalAmount),
      createdAt: schedule.createdAt
    }));
  } catch (error) {
    console.error('Error fetching scheduled orders:', error);
    return [];
  }
};

// Create a new scheduled order
export const createScheduledOrder = async (scheduleData) => {
  try {
    const response = await axios.post(`${API_URL}/scheduled`, scheduleData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error creating scheduled order:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

// Update a scheduled order
export const updateScheduledOrder = async (scheduleId, scheduleData) => {
  try {
    const response = await axios.put(
      `${API_URL}/scheduled/${scheduleId}`,
      scheduleData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error updating scheduled order:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

// Delete a scheduled order
export const deleteScheduledOrder = async (scheduleId) => {
  try {
    const response = await axios.delete(`${API_URL}/scheduled/${scheduleId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting scheduled order:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.patch(`${API_URL}/${orderId}/cancel`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error cancelling order:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

// Download order receipt
export const downloadOrderReceipt = async (orderId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${orderId}/receipt`,
      {
        ...getAuthHeaders(),
        responseType: 'blob',
      }
    );
    
    // Handle PDF download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('❌ Error downloading receipt:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};