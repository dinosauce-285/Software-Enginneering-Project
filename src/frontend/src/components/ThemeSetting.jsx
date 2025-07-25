import React, { useState } from 'react';
import SettingRow from './SettingRow';

export default function ThemeSetting() {
    const themes = ["Light", "Dark"];
    const [theme, setTheme] = useState("Light");

    const toggleTheme = () => {
        const nextTheme = theme === "Light" ? "Dark" : "Light";
        setTheme(nextTheme);

        // 🧪 Có thể gọi API ở đây để lưu theme mới
        // fetch('/api/update-theme', { method: 'POST', body: JSON.stringify({ theme: nextTheme }) })
    };

    return (
        <SettingRow
            label="Theme"
            value={theme}
            onClick={toggleTheme}
        />
    );
}
