import axios from "axios";

const API_URL = "http://localhost:8080/api/waste";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


export const registerWaste = async (wasteData) => {
  try {
    const response = await axios.post(API_URL, wasteData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error registrando desperdicio:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};


export const getAllWaste = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};


export const getWasteByIngredient = async (ingredientId) => {
  const response = await axios.get(`${API_URL}/ingredient/${ingredientId}`, getAuthHeaders());
  return response.data;
};


export const deleteWaste = async (wasteId) => {
  const response = await axios.delete(`${API_URL}/${wasteId}`, getAuthHeaders());
  return response.data;
};