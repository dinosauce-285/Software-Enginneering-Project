// src/contexts/ThemeContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Tạo một Context mới
const ThemeContext = createContext();

/**
 * Hàm này sẽ được gọi một lần khi ứng dụng khởi động để xác định theme ban đầu.
 * Ưu tiên:
 * 1. Lấy theme đã được người dùng lưu trong localStorage.
 * 2. Nếu không có, kiểm tra xem hệ điều hành của người dùng có đang ở chế độ tối không.
 * 3. Nếu không, mặc định là chế độ sáng.
 */
const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('theme');
        if (typeof storedPrefs === 'string') {
            return storedPrefs;
        }

        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) {
            return 'Dark';
        }
    }
    return 'Light'; // Mặc định hoặc fallback
};


// 2. Tạo Provider Component
// Component này sẽ bọc toàn bộ ứng dụng của bạn và cung cấp state, hàm cho các component con.
export const ThemeProvider = ({ children }) => {
    // Tạo state để lưu theme hiện tại, với giá trị khởi tạo từ hàm trên
    const [theme, setTheme] = useState(getInitialTheme);

    // useEffect sẽ chạy mỗi khi giá trị của `theme` thay đổi
    useEffect(() => {
        const root = window.document.documentElement; // Thẻ <html>

        // Xóa class cũ trước khi thêm class mới để đảm bảo sạch sẽ
        root.classList.remove(theme === 'Dark' ? 'light' : 'dark');
        root.classList.add(theme.toLowerCase()); // Thêm class 'dark' hoặc 'light'

        // Lưu lựa chọn của người dùng vào localStorage để có tính bền vững
        localStorage.setItem('theme', theme);
    }, [theme]);


    // Hàm để chuyển đổi theme
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'Light' ? 'Dark' : 'Light'));
    };

    // Giá trị mà chúng ta sẽ cung cấp cho các component con
    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};


// 3. Tạo một hook tùy chỉnh để dễ dàng sử dụng context
// Thay vì phải import useContext và ThemeContext ở mọi nơi, chúng ta chỉ cần import useTheme.
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};