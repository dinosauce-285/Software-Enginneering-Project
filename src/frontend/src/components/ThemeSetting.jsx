import React, { useState } from 'react';
import SettingRow from './SettingRow';

export default function ThemeSetting() {
    const themes = ["Light", "Dark"];
    const [theme, setTheme] = useState("Light");

    const toggleTheme = () => {
        const nextTheme = theme === "Light" ? "Dark" : "Light";
        setTheme(nextTheme);
    };

    return (
        <SettingRow
            label="Theme"
            value={theme}
            onClick={toggleTheme}
        />
    );
}
