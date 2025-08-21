// src/contexts/ThemeContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

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
    return 'Light'; 
};



export const ThemeProvider = ({ children }) => {
   
    const [theme, setTheme] = useState(getInitialTheme);
    useEffect(() => {
        const root = window.document.documentElement; 
        root.classList.remove(theme === 'Dark' ? 'light' : 'dark');
        root.classList.add(theme.toLowerCase());
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'Light' ? 'Dark' : 'Light'));
    };
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


export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};