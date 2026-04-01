import axios from "axios";

const API_URL = "http://localhost:8080/api/dishes";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ CREATE DISH
export const createDish = async (dishData) => {
  try {
    const response = await axios.post(API_URL, dishData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error creating dish:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};

// ✅ GET ALL DISHES
export const getAllDishes = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// ✅ DELETE DISH
export const deleteDish = async (dishId) => {
  const response = await axios.delete(`${API_URL}/${dishId}`, getAuthHeaders());
  return response.data;
};
