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

// Cấu hình một instance của axios với các cài đặt mặc định
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Địa chỉ của server backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor tự động gắn token vào mọi request gửi đi
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

/**
 * Đăng ký tài khoản mới.
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
 * Đăng nhập và lưu thông tin vào localStorage.
 */
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

/**
 * Đăng nhập bằng Firebase và lưu thông tin.
 */
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

/**
 * Lấy thông tin cá nhân của người dùng đã đăng nhập.
 * Hàm này rất quan trọng cho AuthContext.
 */
export const getProfile = async () => {
    try {
        // Endpoint này cần được backend hỗ trợ: nhận token và trả về thông tin user.
        const response = await apiClient.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * Đăng xuất bằng cách xóa dữ liệu khỏi localStorage.
 */
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

/**
 * Lấy danh sách Ký ức của người dùng.
 */
export const getMyMemories = async () => {
  try {
    const response = await apiClient.get('/memories');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Tạo một Ký ức mới.
 */
export const createMemory = async (memoryData) => {
  try {
    const response = await apiClient.post('/memories', memoryData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Lấy chi tiết một Ký ức.
 */
export const getMemoryById = async (memoryId) => {
  try {
    const response = await apiClient.get(`/memories/${memoryId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Xóa một Ký ức.
 */
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

/**
 * Tải lên media cho một Ký ức.
 */
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


// ========================================================
//                   EMOTION SERVICES
// ========================================================

/**
 * Lấy danh sách tất cả các cảm xúc.
 */
export const getEmotions = async () => {
  try {
    const response = await apiClient.get('/emotions');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};