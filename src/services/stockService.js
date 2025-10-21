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

// Para editar ingrediente completo (desde modal)
export const updateStockItem = async (id, ingredientData) => {
  console.log('🔍 updateStockItem - ID:', id);
  console.log('🔍 updateStockItem - Data original:', ingredientData);
  
  try {
    // Ahora tu backend acepta el objeto completo con currentStock
    const response = await axios.put(
      `${API_URL}/${id}`,
      {
        name: ingredientData.name,
        currentStock: ingredientData.currentStock, // Cambiar de newStock a currentStock
        minimumStock: ingredientData.minimumStock,
        unit: ingredientData.unit
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

// Para actualización rápida solo del stock actual
export const updateStockOnly = async (id, newStock) => {
  const response = await axios.put(`${API_URL}/${id}/stock?newStock=${newStock}`, {}, getAuthHeaders());
  return response.data;
};

export const deleteStockItem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};