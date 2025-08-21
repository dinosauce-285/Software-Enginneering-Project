import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log(`[API Client] Base URL is set to: ${API_BASE_URL}`);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================================
//                 AUTHENTICATION SERVICES
// ========================================================

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
    if (response.data.accessToken && response.data.user) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const authenticateWithFirebase = async (idToken) => {
  try {
    const response = await apiClient.post('/auth/firebase', { idToken });
    if (response.data.accessToken && response.data.user) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (otpVerificationToken, newPassword) => {
  try {
    const response = await apiClient.post('/auth/reset-password', { otpVerificationToken, newPassword });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// ========================================================
//                    USER SERVICES
// ========================================================

export const changeUsername = async (newUsername) => {
  try {
    const response = await apiClient.post('/auth/change-username', { newUsername });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadAvatar = async (avatarFile) => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  try {
    const response = await apiClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ========================================================
//                    MEMORY SERVICES
// ========================================================

export const getMyMemories = async () => {
  try {
    const response = await apiClient.get('/memories');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchMemories = async (params) => {
  try {
    const response = await apiClient.get('/memories/search', { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createMemory = async (memoryData) => {
  try {
    const response = await apiClient.post('/memories', memoryData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMemoryById = async (memoryId) => {
  try {
    const response = await apiClient.get(`/memories/${memoryId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateMemory = async (memoryId, memoryData) => {
  try {
    const response = await apiClient.patch(`/memories/${memoryId}`, memoryData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteMemoryById = async (memoryId) => {
  try {
    const response = await apiClient.delete(`/memories/${memoryId}`);
    return response.status;
  } catch (error) {
    throw error.response.data;
  }
};

// ========================================================
//                     MEDIA SERVICES
// ========================================================

export const uploadMediaForMemory = async (memoryId, files) => {
  if (!files || files.length === 0) return;

  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await apiClient.post(`/memories/${memoryId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteMediaById = async (mediaId) => {
  try {
    const response = await apiClient.delete(`/memories/media/${mediaId}`);
    return response.status;
  } catch (error) {
    throw error.response.data;
  }
};

// ========================================================
//               SHARE & REPORT SERVICES
// ========================================================

export const getSharedMemoryByToken = async (token) => {
  try {
    const response = await apiClient.get(`/share/${token}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createShareLink = async (memoryId, options = {}) => {
  try {
    const response = await apiClient.post(`/memories/${memoryId}/share`, options);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEmotionReport = async (startDate, endDate) => {
  try {
    const response = await apiClient.get('/reports/emotions', {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ========================================================
//                   EMOTION SERVICES
// ========================================================

export const getEmotions = async () => {
  try {
    const response = await apiClient.get('/emotions');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ========================================================
//                   REMINDER SERVICES
// ========================================================

export const getReminders = async () => {
  try {
    const response = await apiClient.get('/reminders');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const markReminderAsRead = async (reminderId) => {
  try {
    const response = await apiClient.patch(`/reminders/${reminderId}/read`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

// ========================================================
//                   ADMIN SERVICES
// ========================================================

export const getAllUsers = async (params) => {
  try {
    const response = await apiClient.get('/users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.patch(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

export async function getActivityLogs() {
  const res = await fetch('http://localhost:3000/activity-logs');
  if (!res.ok) throw new Error('Failed to fetch activity logs');
  return res.json();
}
export const getUserSettings = async () => {
  try {
    // API /auth/profile thường trả về toàn bộ đối tượng user, bao gồm cả settings.
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Cập nhật cài đặt của người dùng hiện tại.
 * @param {object} settingsData - Dữ liệu cài đặt, ví dụ: { reminderTime: "10:30" }
 */
export const updateUserSettings = async (settingsData) => {
  try {
    // Gọi đến endpoint PATCH /users/me/settings mà bạn đã tạo ở backend
    const response = await apiClient.patch('/users/me/settings', settingsData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};