import axios from "axios";

const API_URL = "http://localhost:8080/api/sales";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// CREATE SALE
export const createSale = async (saleData) => {
  try {
    const response = await axios.post(API_URL, saleData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error creating sale:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};

// GET ALL SALE
export const getAllSales = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// DELETE SALE
export const deleteSale = async (saleId) => {
  const response = await axios.delete(`${API_URL}/${saleId}`, getAuthHeaders());
  return response.data;
};
