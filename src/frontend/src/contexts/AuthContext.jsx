// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { getProfile, logoutUser as apiLogout, changeUsername as apiChangeUsername, loginUser as apiLoginUser } from '../services/api';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const _updateUserAndStorage = (userData) => {
//         setUser(userData);
//         if (userData) {
//             localStorage.setItem('user', JSON.stringify(userData));
//         } else {
//             localStorage.removeItem('user');
//         }
//     };

//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             const token = localStorage.getItem('accessToken');
//             const storedUser = localStorage.getItem('user');

//             if (token) {
//                 if (storedUser) {
//                     setUser(JSON.parse(storedUser));
//                 }
//                 try {
//                     const freshUserData = await getProfile();
//                     setUser(freshUserData);
//                 } catch (error) {
//                     console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...", error);
//                     apiLogout();
//                     setUser(null);
//                 }
//             }
//             setIsLoading(false);
//         };

//         fetchUserProfile();
//     }, []);

//     /**
//      * @param {object} userData 
//      */
//     const login = (userData) => {
//         setUser(userData);
//     };

//     const logout = () => {
//         setUser(null);
//         apiLogout();
//     };

//     const value = { user, setUser, login, logout, isLoading };

//     return (
//         <AuthContext.Provider value={value}>
//             {!isLoading && children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Import tất cả các hàm API cần thiết từ lớp dịch vụ
import {
    getProfile,
    loginUser as apiLogin,
    logoutUser as apiLogout,
    changeUsername as apiChangeUsername // Import hàm mới
} from '../services/api';

// Tạo Context
const AuthContext = createContext(null);

// Tạo Provider Component
export const AuthProvider = ({ children }) => {
    // State để lưu thông tin người dùng
    const [user, setUser] = useState(null);
    // State để theo dõi quá trình tải dữ liệu ban đầu
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Hàm nội bộ để cập nhật state và localStorage một cách đồng bộ.
     * Đây là cách duy nhất để thay đổi dữ liệu người dùng trong Context.
     * @param {object | null} userData - Đối tượng user hoặc null.
     */
    const updateUserAndStorage = (userData) => {
        if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    // useEffect chỉ chạy một lần khi ứng dụng khởi động
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('accessToken');

            // Nếu có token, thử lấy thông tin người dùng mới nhất từ server
            if (token) {
                try {
                    const freshUserData = await getProfile();
                    updateUserAndStorage(freshUserData); // Cập nhật cả state và storage
                } catch (error) {
                    console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...", error);
                    // Nếu token lỗi, thực hiện đăng xuất sạch sẽ
                    apiLogout(); // Xóa token và user khỏi localStorage
                    updateUserAndStorage(null); // Xóa user khỏi state
                }
            }
            // Đánh dấu quá trình khởi tạo đã hoàn tất
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    /**
     * Xử lý logic đăng nhập.
     * Gọi API và cập nhật trạng thái ứng dụng.
     * @param {object} credentials - { email, password }
     */

    // const login = async (credentials) => {
    //     // apiLogin đã xử lý việc lưu token và user vào localStorage
    //     const authData = await apiLogin(credentials);
    //     updateUserAndStorage(authData.user); // Cập nhật state với dữ liệu trả về
    // };

    const login = (userData) => {
        updateUserAndStorage(userData);
    };

    /**
     * Xử lý logic đăng xuất.
     */
    const logout = () => {
        apiLogout(); // Xóa token và user khỏi localStorage
        updateUserAndStorage(null); // Xóa user khỏi state
    };

    /**
     * Hàm quan trọng: Gọi API để thay đổi username và cập nhật trạng thái trên toàn ứng dụng.
     * @param {string} newUsername
     * @returns {Promise<void>}
     * @throws {Error} Ném lỗi nếu API thất bại để component có thể bắt và hiển thị.
     */
    const changeUsername = async (newUsername) => {
        try {
            // Gọi hàm API đã được định nghĩa trong services/api.js
            const updatedUser = await apiChangeUsername(newUsername);

            // Cập nhật trạng thái và localStorage với dữ liệu mới nhất từ API
            updateUserAndStorage(updatedUser);
        } catch (error) {
            console.error("Failed to change username:", error);
            // Ném lỗi ra để component có thể xử lý (ví dụ: hiển thị thông báo lỗi)
            throw error;
        }
    };

    // Tạo đối tượng giá trị để cung cấp cho các component con
    const value = {
        user,
        isLoading,
        login,
        logout,
        changeUsername // Cung cấp hàm mới này
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Chỉ render các component con khi quá trình xác thực ban đầu đã hoàn tất */}
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// Hook tùy chỉnh để dễ dàng sử dụng Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};