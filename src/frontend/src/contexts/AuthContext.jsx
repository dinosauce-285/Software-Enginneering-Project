// // src/contexts/AuthContext.jsx
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { getProfile, logoutUser as apiLogout } from '../services/api'; 



// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null); 
//     const [isLoading, setIsLoading] = useState(true); 
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

// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, logoutUser as apiLogout } from '../services/api';

// Hàm helper để lấy dữ liệu user từ localStorage một cách an toàn
const getInitialUser = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Lỗi khi đọc user từ localStorage", error);
        return null;
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getInitialUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                try {
                    const freshUserData = await getProfile();
                    setUser(freshUserData);
                    localStorage.setItem('user', JSON.stringify(freshUserData));
                } catch (error) {
                    console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...", error);
                    handleLogout();
                }
            }
            setIsLoading(false);
        };

        fetchUserProfile();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', token);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
        apiLogout();
    };

    const updateUser = (newUserData) => {
        if (newUserData) {
            setUser(newUserData);
            localStorage.setItem('user', JSON.stringify(newUserData));
        }
    };

    const value = {
        user,
        isLoading,
        login,
        logout: handleLogout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};