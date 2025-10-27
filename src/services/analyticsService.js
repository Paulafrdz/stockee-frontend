import axios from "axios";

const API_URL = "http://localhost:8080/api/analytics";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Obtener estadísticas generales para las cards
 */
export const getAnalyticsStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching analytics stats:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};

/**
 * Obtener datos para el gráfico de tipos de desperdicio
 */
export const getWasteTypesData = async () => {
  try {
    const response = await axios.get(`${API_URL}/waste-types`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching waste types data:', error);
    throw error;
  }
};

/**
 * Obtener datos para el gráfico de tendencias
 */
export const getWasteTrendData = async () => {
  try {
    const response = await axios.get(`${API_URL}/waste-trend`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching waste trend data:', error);
    throw error;
  }
};

export default {
  getAnalyticsStats,
  getWasteTypesData,
  getWasteTrendData
};