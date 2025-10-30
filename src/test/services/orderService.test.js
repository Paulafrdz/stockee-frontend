import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { getRecommendedOrders, submitOrder, getOrderHistory } from '../../services/orderService';

// Mock axios
vi.mock('axios');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

describe('orderService', () => {
  const API_URL = 'http://localhost:8080/api/orders';
  const mockToken = 'fake-jwt-token';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', mockToken);
    
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== getRecommendedOrders ====================

  describe('getRecommendedOrders', () => {
    const mockBackendData = [
      {
        id: 1,
        name: 'Tomate',
        currentStock: '5',
        minimumStock: '10',
        recommendedQuantity: '15',
        weeklyUsage: '8.5',
        unit: 'kg',
        priority: 'high',
        lastOrderDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Cebolla',
        currentStock: '12.5',
        minimumStock: '8',
        recommendedQuantity: null,
        weeklyUsage: '6',
        unit: 'kg',
        priority: 'low',
        lastOrderDate: '2024-01-10'
      }
    ];

    it('should fetch and transform recommended orders successfully', async () => {
      axios.get.mockResolvedValue({ data: mockBackendData });

      const result = await getRecommendedOrders();

      expect(axios.get).toHaveBeenCalledWith(API_URL, {
        headers: {
          Authorization: `Bearer ${mockToken}`
        }
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        name: 'Tomate',
        currentStock: 5,
        minimumStock: 10,
        recommendedQuantity: 15,
        weeklyUsage: 8.5,
        unit: 'kg',
        priority: 'high',
        lastOrderDate: '2024-01-15'
      });
    });

    it('should parse string numbers to floats and handle null values', async () => {
      axios.get.mockResolvedValue({ data: mockBackendData });

      const result = await getRecommendedOrders();

      expect(typeof result[0].currentStock).toBe('number');
      expect(typeof result[0].weeklyUsage).toBe('number');
      expect(result[1].recommendedQuantity).toBe(0);
    });

    it('should default priority to medium if not provided', async () => {
      const dataWithoutPriority = [{
        id: 1,
        name: 'Test',
        currentStock: '5',
        minimumStock: '10',
        recommendedQuantity: '15',
        weeklyUsage: '8',
        unit: 'kg',
        lastOrderDate: '2024-01-15'
      }];

      axios.get.mockResolvedValue({ data: dataWithoutPriority });

      const result = await getRecommendedOrders();

      expect(result[0].priority).toBe('medium');
    });

    it('should return empty array and log error on failure', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      const result = await getRecommendedOrders();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching recommended orders:',
        error
      );
    });
  });

  // ==================== submitOrder ====================

  describe('submitOrder', () => {
    const mockOrderData = {
      items: [
        {
          ingredientId: 1,
          ingredientName: 'Tomate',
          quantity: 10,
          unit: 'kg'
        },
        {
          ingredientId: 2,
          ingredientName: 'Cebolla',
          quantity: 5,
          unit: 'kg'
        }
      ]
    };

    const mockBackendResponse = {
      data: {
        id: 123,
        orderDate: '2024-01-15',
        items: mockOrderData.items
      }
    };

    it('should submit order successfully with correct structure', async () => {
      axios.post.mockResolvedValue(mockBackendResponse);

      const result = await submitOrder(mockOrderData);

      expect(axios.post).toHaveBeenCalledWith(
        API_URL,
        { items: mockOrderData.items },
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual({
        success: true,
        orderId: 123,
        items: mockOrderData.items,
        itemCount: 2
      });
    });

    it('should only send items to backend and ignore extra fields', async () => {
      const orderWithExtraData = {
        items: mockOrderData.items,
        someExtraField: 'should not be sent',
        anotherField: 123
      };

      axios.post.mockResolvedValue(mockBackendResponse);

      await submitOrder(orderWithExtraData);

      expect(axios.post).toHaveBeenCalledWith(
        API_URL,
        { items: mockOrderData.items },
        expect.any(Object)
      );
    });

    it('should generate fallback orderId if backend does not return one', async () => {
      const responseWithoutId = {
        data: {
          orderDate: '2024-01-15'
        }
      };

      axios.post.mockResolvedValue(responseWithoutId);

      const result = await submitOrder(mockOrderData);

      expect(result.orderId).toMatch(/^order_\d+$/);
    });

    it('should throw error and log when submission fails', async () => {
      const error = new Error('Server error');
      axios.post.mockRejectedValue(error);

      await expect(submitOrder(mockOrderData)).rejects.toThrow('Server error');
      expect(console.error).toHaveBeenCalledWith(
        '❌ Error submitting order:',
        error
      );
    });

    it('should handle empty items array', async () => {
      const emptyOrder = { items: [] };
      axios.post.mockResolvedValue({ data: { id: 1 } });

      const result = await submitOrder(emptyOrder);

      expect(result.itemCount).toBe(0);
      expect(result.items).toEqual([]);
    });
  });

  // ==================== getOrderHistory ====================

  describe('getOrderHistory', () => {
    const mockHistoryData = [
      {
        id: 1,
        orderDate: '2024-01-15T10:00:00Z',
        items: [
          { ingredientName: 'Tomate', quantity: 10 }
        ],
        itemCount: 1
      },
      {
        id: 2,
        orderDate: '2024-01-10T15:30:00Z',
        items: [
          { ingredientName: 'Cebolla', quantity: 5 },
          { ingredientName: 'Ajo', quantity: 2 }
        ],
        itemCount: 2
      }
    ];

    it('should fetch order history with default limit', async () => {
      axios.get.mockResolvedValue({ data: mockHistoryData });

      const result = await getOrderHistory();

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/history?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        date: '2024-01-15T10:00:00Z',
        items: [
          { ingredientName: 'Tomate', quantity: 10 }
        ],
        itemCount: 1
      });
    });

    it('should use custom limit when specified', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await getOrderHistory(100);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/history?limit=100`,
        expect.any(Object)
      );
    });

    it('should return empty array and log error on failure', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      const result = await getOrderHistory();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching order history:',
        error
      );
    });

    it('should handle orders without items', async () => {
      const ordersWithoutItems = [
        {
          id: 1,
          orderDate: '2024-01-15T10:00:00Z',
          itemCount: 0
        }
      ];

      axios.get.mockResolvedValue({ data: ordersWithoutItems });

      const result = await getOrderHistory();

      expect(result[0].items).toEqual([]);
    });
  });

  // ==================== Authentication ====================

  describe('Authentication Headers', () => {
    it('should use token from localStorage in all requests', async () => {
      localStorage.setItem('token', 'custom-token-123');

      axios.get.mockResolvedValue({ data: [] });
      axios.post.mockResolvedValue({ data: { id: 1 } });

      await getRecommendedOrders();
      await submitOrder({ items: [] });
      await getOrderHistory();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer custom-token-123'
          })
        })
      );

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer custom-token-123'
          })
        })
      );
    });
  });

  // ==================== Edge Cases ====================

  describe('Edge Cases', () => {
    it('should handle 401 unauthorized errors gracefully', async () => {
      const unauthorizedError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      axios.get.mockRejectedValue(unauthorizedError);

      const result = await getRecommendedOrders();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle timeout and network errors', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      };

      axios.post.mockRejectedValue(timeoutError);

      await expect(submitOrder({ items: [] })).rejects.toMatchObject({
        code: 'ECONNABORTED'
      });
    });
  });
});