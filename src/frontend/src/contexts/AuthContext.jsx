// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile } from '../services/api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('accessToken'); 

            if (token) {
                try {
                    const userData = await getProfile(); 
                    console.log("Dữ liệu nhận được từ API getProfile:", userData);
                    setUser(userData); 
                } catch (error) {
                    console.error("Lỗi khi gọi getProfile:", error);
          
                    localStorage.removeItem('accessToken'); 
                    setUser(null);
                }
            } else {
                 console.log("AuthContext: Không tìm thấy 'accessToken' trong localStorage.");
            }
            setIsLoading(false); 
        };

        fetchUserProfile();
    }, []); 

   
    const value = { user, setUser, isLoading }; 

    return (
        <AuthContext.Provider value={value}>

            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};