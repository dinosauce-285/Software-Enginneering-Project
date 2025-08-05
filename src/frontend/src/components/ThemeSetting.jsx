// import React, { useState } from 'react';
// import SettingRow from './SettingRow';

// export default function ThemeSetting() {
//     const themes = ["Light", "Dark"];
//     const [theme, setTheme] = useState("Light");

//     const toggleTheme = () => {
//         const nextTheme = theme === "Light" ? "Dark" : "Light";
//         setTheme(nextTheme);
//     };

//     return (
//         <SettingRow
//             label="Theme"
//             value={theme}
//             onClick={toggleTheme}
//         />
//     );
// }
import React from 'react';
import SettingRow from './SettingRow';
// 1. IMPORT hook `useTheme` từ Context của bạn
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSetting() {
    // 2. LẤY TRẠNG THÁI VÀ HÀM TỪ CONTEXT
    //    Không còn dùng useState ở đây nữa.
    const { theme, toggleTheme } = useTheme();

    // 3. Sử dụng các giá trị từ context
    return (
        <SettingRow
            label="Theme"
            value={theme}       // `value` bây giờ là trạng thái chung của toàn ứng dụng
            onClick={toggleTheme} // `onClick` bây giờ gọi hàm chung để thay đổi theme
        />
    );
}
