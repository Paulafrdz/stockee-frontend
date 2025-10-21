import axios from "axios";

const API_URL = "http://localhost:8080/api/stock";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getStockItems = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const addStockItem = async (item) => {
  const response = await axios.post(API_URL, item, getAuthHeaders());
  return response.data;
};

export const updateStockItem = async (id, newStock) => {
  const response = await axios.put(`${API_URL}/${id}`, { currentStock: newStock }, getAuthHeaders());
  return response.data;
};

export const deleteStockItem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
