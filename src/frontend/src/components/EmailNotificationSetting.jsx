import React, { useState } from 'react';
import SettingRow from './SettingRow';

export default function EmailNotificationSetting() {
    const [enabled, setEnabled] = useState(true);

    const toggleNotification = () => {
        setEnabled(prev => !prev);

    };

    return (
        <SettingRow
            label="Receive Email Notifications"
            value={enabled ? "Enabled" : "Disabled"}
            onClick={toggleNotification}
        />
    );
}
