// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});


export const signUpUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/signin', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const authenticateWithFirebase = async (idToken) => {
  try {
    const response = await apiClient.post('/auth/firebase', { idToken });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Hàm gọi API để tạo một kỷ niệm mới.
 * Yêu cầu phải có accessToken trong localStorage.
 * @param {object} memoryData - Dữ liệu của kỷ niệm mới (title, content, emotionID, tags).
 */
export const createMemory = async (memoryData) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found. Please log in.');
  }

  try {
    const response = await apiClient.post('/memories', memoryData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {

    throw error.response.data;
  }
};


export const getMyMemories = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found. Please log in.');
  }

  try {
    const response = await apiClient.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getEmotions = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found. Please log in.');
  }

  try {
    const response = await apiClient.get('/emotions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Upload một file media cho một memory đã tồn tại.
 * @param {string} memoryId - ID của memory
 * @param {File} file - File object để upload
 */
export const uploadMediaForMemory = async (memoryId, file) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found.');
  }


  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(`/memories/${memoryId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};