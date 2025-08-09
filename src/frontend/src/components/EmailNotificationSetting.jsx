// src/components/EmailNotificationSetting.jsx

import React, { useState } from 'react';
import SettingRow from './SettingRow';
import ToggleSwitch from './ToggleSwitch';

export default function EmailNotificationSetting() {
    const [enabled, setEnabled] = useState(true);

    const toggleNotification = () => {
        setEnabled(prev => !prev);
    };

    return (
        <SettingRow label="Receive Email Notifications">
            <ToggleSwitch enabled={enabled} onChange={toggleNotification} />
        </SettingRow>
    );
}