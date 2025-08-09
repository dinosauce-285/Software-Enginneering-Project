// src/components/SettingsGroup.jsx

import React from 'react';

export default function SettingsGroup({ children }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {children}
            </div>
        </div>
    );
}