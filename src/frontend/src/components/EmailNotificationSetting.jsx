import React, { useState } from 'react';
import SettingRow from './SettingRow';

export default function EmailNotificationSetting() {
    const [enabled, setEnabled] = useState(true);

    const toggleNotification = () => {
        setEnabled(prev => !prev);
        // 🧪 Có thể gọi API ở đây để lưu trạng thái mới
        // fetch('/api/update-notifications', { method: 'POST', body: JSON.stringify({ enabled: !enabled }) })
    };

    return (
        <SettingRow
            label="Receive Email Notifications"
            value={enabled ? "Enabled" : "Disabled"}
            onClick={toggleNotification}
        />
    );
}
