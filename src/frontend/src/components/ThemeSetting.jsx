
import React from 'react';
import SettingRow from './SettingRow';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSetting() {

    const { theme, toggleTheme } = useTheme();


    return (
        <SettingRow
            label="Theme"
            value={theme}       
            onClick={toggleTheme} 
        />
    );
}
