// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, logoutUser as apiLogout } from '../services/api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); 
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('accessToken'); 
            const storedUser = localStorage.getItem('user'); 
            if (token) {
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            
                try {
                    const freshUserData = await getProfile(); 
                    setUser(freshUserData); 
                } catch (error) {
                    console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...", error);
                    apiLogout(); 
                    setUser(null);
                }
            }
            setIsLoading(false); 
        };

        fetchUserProfile();
    }, []); 
    /**
     * @param {object} userData 
     */
    const login = (userData) => {
        setUser(userData);
    
    };


    const logout = () => {
        setUser(null);
        apiLogout(); 
    };

    
    const value = { user, setUser, login, logout, isLoading }; 

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};