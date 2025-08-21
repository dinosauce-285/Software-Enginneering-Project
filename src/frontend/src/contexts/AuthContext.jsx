import React, { createContext, useState, useEffect, useContext } from 'react';

import {
    getProfile,
    loginUser as apiLogin,
    logoutUser as apiLogout,
    changeUsername as apiChangeUsername
} from '../services/api';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

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

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const freshUserData = await getProfile();
                    updateUserAndStorage(freshUserData);
                } catch (error) {
                    console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...", error);
                    apiLogout();
                    updateUserAndStorage(null);
                }
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    /**
     * Xử lý logic đăng nhập.
     * Gọi API và cập nhật trạng thái ứng dụng.
     * @param {object} credentials - { email, password }
     */


    const login = (userData) => {
        updateUserAndStorage(userData);
    };

    const logout = () => {
        apiLogout();
        updateUserAndStorage(null);
    };

    /**
     * @param {string} newUsername
     * @returns {Promise<void>}
     * @throws {Error} 
     */
    const changeUsername = async (newUsername) => {
        try {
            const updatedUser = await apiChangeUsername(newUsername);
            updateUserAndStorage(updatedUser);
        } catch (error) {
            console.error("Failed to change username:", error);

            throw error;
        }
    };

    const value = {
        user,
        setUser,
        isLoading,
        login,
        logout,
        changeUsername 
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};