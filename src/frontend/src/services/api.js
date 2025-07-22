// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Hàm gọi API để đăng ký tài khoản mới bằng email.
 */
export const signUpUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Hàm gọi API để đăng nhập bằng email.
 */
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

/**
 * Gửi Firebase ID Token (từ Google) đến backend để xác thực.
 */
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
  // 1. Lấy token từ localStorage
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found. Please log in.');
  }

  try {
    // 2. Gọi API với header Authorization
    const response = await apiClient.post('/memories', memoryData, {
      headers: {
        Authorization: `Bearer ${token}`, // <-- Gửi token theo request
      },
    });
    return response.data;
  } catch (error) {
    // Ném lỗi để component có thể bắt và hiển thị cho người dùng
    throw error.response.data;
  }
};

// ==========================================================
// THÊM CẢ HÀM NÀY ĐỂ DÙNG CHO PHẦN HIỂN THỊ DASHBOARD SAU NÀY
// ==========================================================

/**
 * Hàm gọi API để lấy danh sách tất cả các kỷ niệm của người dùng.
 */
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

/**
 * Hàm gọi API để lấy danh sách tất cả các cảm xúc.
 */
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

  // Sử dụng FormData để gửi file
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(`/memories/${memoryId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Quan trọng cho việc upload file
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};