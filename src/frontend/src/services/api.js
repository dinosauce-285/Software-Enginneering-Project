// // src/services/api.js
// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'http://localhost:3000',
//   headers: { 'Content-Type': 'application/json' },
// });


// export const signUpUser = async (userData) => {
//   try {
//     const response = await apiClient.post('/auth/signup', userData);
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };


// export const loginUser = async (credentials) => {
//   try {
//     const response = await apiClient.post('/auth/signin', credentials);
//     if (response.data.accessToken) {
//       localStorage.setItem('accessToken', response.data.accessToken);
//     }
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };


// export const authenticateWithFirebase = async (idToken) => {
//   try {
//     const response = await apiClient.post('/auth/firebase', { idToken });
//     if (response.data.accessToken) {
//       localStorage.setItem('accessToken', response.data.accessToken);
//     }
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };

// /**
//  * Hàm gọi API để tạo một kỷ niệm mới.
//  * Yêu cầu phải có accessToken trong localStorage.
//  * @param {object} memoryData - Dữ liệu của kỷ niệm mới (title, content, emotionID, tags).
//  */
// export const createMemory = async (memoryData) => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) {
//     throw new Error('No access token found. Please log in.');
//   }

//   try {
//     const response = await apiClient.post('/memories', memoryData, {
//       headers: {
//         Authorization: `Bearer ${token}`, 
//       },
//     });
//     return response.data;
//   } catch (error) {

//     throw error.response.data;
//   }
// };


// export const getMyMemories = async () => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) {
//     throw new Error('No access token found. Please log in.');
//   }

//   try {
//     const response = await apiClient.get('/memories', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };

// // ... các hàm khác ...

// /**
//  * Xóa token khỏi localStorage để đăng xuất người dùng.
//  */
// export const logoutUser = () => {
//   try {
//     localStorage.removeItem('accessToken');
//   } catch (error) {
//     console.error("Error during logout:", error);
//   }
// };
// export const getEmotions = async () => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) {
//     throw new Error('No access token found. Please log in.');
//   }

//   try {
//     const response = await apiClient.get('/emotions', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };

// /**
//  * Tải lên NHIỀU file media cho một memory.
//  * @param {string} memoryId - ID của memory.
//  * @param {File[]} files - Một mảng các đối tượng File để upload.
//  */
// export const uploadMediaForMemory = async (memoryId, files) => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) throw new Error('No access token found.');
//   if (!files || files.length === 0) return; // Không làm gì nếu không có file

//   // 1. Tạo một đối tượng FormData
//   const formData = new FormData();

//   // 2. Lặp qua mảng file và thêm từng file vào FormData
//   // Tên trường 'files' phải khớp với tên trong FilesInterceptor của backend
//   files.forEach(file => {
//     formData.append('files', file);
//   });

//   try {
//     // 3. Gửi request với FormData
//     const response = await apiClient.post(`/memories/${memoryId}/media`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data', // Quan trọng cho việc upload file
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };

// /**
//  * Hàm gọi API để lấy chi tiết một kỷ niệm bằng ID của nó.
//  * @param {string} memoryId - ID của kỷ niệm cần lấy.
//  */
// export const getMemoryById = async (memoryId) => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) {
//     throw new Error('No access token found. Please log in.');
//   }

//   try {
//     const response = await apiClient.get(`/memories/${memoryId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };

// /**
//  * Hàm gọi API để xóa một kỷ niệm bằng ID của nó.
//  * @param {string} memoryId - ID của kỷ niệm cần xóa.
//  */
// export const deleteMemoryById = async (memoryId) => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) {
//     throw new Error('No access token found. Please log in.');
//   }

//   try {
//     // API DELETE không trả về body, chỉ cần status code
//     const response = await apiClient.delete(`/memories/${memoryId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     // Trả về status để xác nhận thành công
//     return response.status;
//   } catch (error) {
//     throw error.response.data;
//   }
// };
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

export const uploadAvatar = async (avatarFile) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found.');

  const formData = new FormData();
  formData.append('avatar', avatarFile); // Tên trường 'avatar' phải khớp với controller

  try {
    const response = await apiClient.post('/users/me/avatar', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Gửi yêu cầu quên mật khẩu đến backend.
 * Backend sẽ tự động gửi email chứa OTP nếu email hợp lệ.
 * @param {string} email - Email của người dùng.
 */
export const forgotPassword = async (email) => {
  try {
    // Gửi request POST đến /auth/forgot-password với body chứa email
    const response = await apiClient.post('/auth/forgot-password', { email });
    // Trả về message thành công từ backend
    return response.data;
  } catch (error) {
    // Ném lỗi ra để component có thể bắt và hiển thị
    throw error.response.data;
  }
};

/**
 * Gửi yêu cầu đặt lại mật khẩu mới cùng với OTP.
 * @param {object} resetData - Dữ liệu gồm { email, otp, newPassword }.
 */
export const resetPassword = async (otpVerificationToken, newPassword) => {
  try {
    const response = await apiClient.post('/auth/reset-password', { otpVerificationToken, newPassword });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return response.data; // Trả về { otpVerificationToken: '...' }
  } catch (error) {
    throw error.response.data;
  }
};