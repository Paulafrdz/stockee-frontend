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
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

describe('orderService - Unit Tests', () => {
  const API_URL = 'http://localhost:8080/api/orders';
  const mockToken = 'fake-jwt-token';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', mockToken);
    
    // Clear console mocks
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== getRecommendedOrders Tests ====================

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

    it('should fetch recommended orders successfully', async () => {
      axios.get.mockResolvedValue({ data: mockBackendData });

      const result = await getRecommendedOrders();

      expect(axios.get).toHaveBeenCalledWith(API_URL, {
        headers: {
          Authorization: `Bearer ${mockToken}`
        }
      });
      expect(result).toHaveLength(2);
    });

    it('should transform backend data to frontend format', async () => {
      axios.get.mockResolvedValue({ data: mockBackendData });

      const result = await getRecommendedOrders();

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

    it('should parse string numbers to floats', async () => {
      axios.get.mockResolvedValue({ data: mockBackendData });

      const result = await getRecommendedOrders();

      expect(typeof result[0].currentStock).toBe('number');
      expect(typeof result[0].minimumStock).toBe('number');
      expect(typeof result[0].weeklyUsage).toBe('number');
    });

    it('should handle null recommendedQuantity', async () => {
      axios.get.mockResolvedValue({ data: mockBackendData });

      const result = await getRecommendedOrders();

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

    it('should include Authorization header with token', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await getRecommendedOrders();

      expect(axios.get).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`
          })
        })
      );
    });

    it('should return empty array on error', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      const result = await getRecommendedOrders();

      expect(result).toEqual([]);
    });

    it('should log error when fetch fails', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      await getRecommendedOrders();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching recommended orders:',
        error
      );
    });

    it('should handle empty response data', async () => {
      axios.get.mockResolvedValue({ data: [] });

      const result = await getRecommendedOrders();

      expect(result).toEqual([]);
    });

    it('should handle malformed data gracefully', async () => {
      const malformedData = [
        {
          id: 1,
          // Missing required fields
        }
      ];

      axios.get.mockResolvedValue({ data: malformedData });

      const result = await getRecommendedOrders();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  // ==================== submitOrder Tests ====================

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

    it('should submit order successfully', async () => {
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
      expect(result.success).toBe(true);
    });

    it('should return order result with correct structure', async () => {
      axios.post.mockResolvedValue(mockBackendResponse);

      const result = await submitOrder(mockOrderData);

      expect(result).toEqual({
        success: true,
        orderId: 123,
        items: mockOrderData.items,
        itemCount: 2
      });
    });

    it('should only send items to backend', async () => {
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

    it('should include Authorization header with token', async () => {
      axios.post.mockResolvedValue(mockBackendResponse);

      await submitOrder(mockOrderData);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`
          })
        })
      );
    });

    it('should log submission attempt', async () => {
      axios.post.mockResolvedValue(mockBackendResponse);

      await submitOrder(mockOrderData);

      expect(console.log).toHaveBeenCalledWith(
        '📤 orderService: Submitting order to backend:',
        mockOrderData
      );
    });

    it('should log successful submission', async () => {
      axios.post.mockResolvedValue(mockBackendResponse);

      await submitOrder(mockOrderData);

      expect(console.log).toHaveBeenCalledWith(
        '✅ orderService: Order submitted successfully:',
        mockBackendResponse.data
      );
    });

    it('should throw error when submission fails', async () => {
      const error = new Error('Server error');
      axios.post.mockRejectedValue(error);

      await expect(submitOrder(mockOrderData)).rejects.toThrow('Server error');
    });

    it('should log error when submission fails', async () => {
      const error = new Error('Server error');
      axios.post.mockRejectedValue(error);

      try {
        await submitOrder(mockOrderData);
      } catch (e) {
        // Expected to throw
      }

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

    it('should handle single item order', async () => {
      const singleItemOrder = {
        items: [
          {
            ingredientId: 1,
            ingredientName: 'Tomate',
            quantity: 10,
            unit: 'kg'
          }
        ]
      };

      axios.post.mockResolvedValue(mockBackendResponse);

      const result = await submitOrder(singleItemOrder);

      expect(result.itemCount).toBe(1);
    });

    it('should handle network errors', async () => {
      const networkError = {
        message: 'Network Error',
        response: undefined
      };

      axios.post.mockRejectedValue(networkError);

      await expect(submitOrder(mockOrderData)).rejects.toThrow('Network Error');
    });

    it('should handle server errors with response', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };

      axios.post.mockRejectedValue(serverError);

      await expect(submitOrder(mockOrderData)).rejects.toMatchObject({
        response: expect.objectContaining({
          status: 500
        })
      });
    });
  });

  // ==================== getOrderHistory Tests ====================

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

    it('should fetch order history successfully', async () => {
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
    });

    it('should transform backend data to frontend format', async () => {
      axios.get.mockResolvedValue({ data: mockHistoryData });

      const result = await getOrderHistory();

      expect(result[0]).toEqual({
        id: 1,
        date: '2024-01-15T10:00:00Z',
        items: [
          { ingredientName: 'Tomate', quantity: 10 }
        ],
        itemCount: 1
      });
    });

    it('should use default limit of 50 when not specified', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await getOrderHistory();

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/history?limit=50`,
        expect.any(Object)
      );
    });

    it('should use custom limit when specified', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await getOrderHistory(100);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/history?limit=100`,
        expect.any(Object)
      );
    });

    it('should include Authorization header with token', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await getOrderHistory();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`
          })
        })
      );
    });

    it('should return empty array on error', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      const result = await getOrderHistory();

      expect(result).toEqual([]);
    });

    it('should log error when fetch fails', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      await getOrderHistory();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching order history:',
        error
      );
    });

    it('should handle empty order history', async () => {
      axios.get.mockResolvedValue({ data: [] });

      const result = await getOrderHistory();

      expect(result).toEqual([]);
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

    it('should handle limit of 0', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await getOrderHistory(0);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/history?limit=0`,
        expect.any(Object)
      );
    });

    it('should handle large limit values', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await getOrderHistory(1000);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/history?limit=1000`,
        expect.any(Object)
      );
    });

    it('should preserve all item data', async () => {
      const detailedHistory = [
        {
          id: 1,
          orderDate: '2024-01-15T10:00:00Z',
          items: [
            {
              ingredientName: 'Tomate',
              quantity: 10,
              unit: 'kg',
              price: 25.50
            }
          ],
          itemCount: 1
        }
      ];

      axios.get.mockResolvedValue({ data: detailedHistory });

      const result = await getOrderHistory();

      expect(result[0].items[0]).toEqual({
        ingredientName: 'Tomate',
        quantity: 10,
        unit: 'kg',
        price: 25.50
      });
    });
  });

  // ==================== Authentication Header Tests ====================

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

    it('should handle missing token', async () => {
      localStorage.removeItem('token');

      axios.get.mockResolvedValue({ data: [] });

      await getRecommendedOrders();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer null'
          })
        })
      );
    });
  });

  // ==================== Edge Cases ====================

  describe('Edge Cases', () => {
    it('should handle undefined response data', async () => {
      axios.get.mockResolvedValue({});

      // Service handles this gracefully and returns empty array
      const result = await getRecommendedOrders();
      
      // Should either return empty array or log error
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle null response', async () => {
      axios.get.mockResolvedValue(null);

      // Service handles this gracefully and returns empty array
      const result = await getRecommendedOrders();
      
      // Should either return empty array or log error
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      };

      axios.post.mockRejectedValue(timeoutError);

      await expect(submitOrder({ items: [] })).rejects.toMatchObject({
        code: 'ECONNABORTED'
      });
    });

    it('should handle 401 unauthorized errors', async () => {
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

    it('should handle 404 not found errors', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      };

      axios.get.mockRejectedValue(notFoundError);

      const result = await getOrderHistory();

      expect(result).toEqual([]);
    });
  });
});