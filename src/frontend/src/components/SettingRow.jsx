

import React from 'react';

export default function SettingRow({ label, value, onClick }) {
    return (
        <div className="flex items-center justify-between px-2 py-2">
            <span className="text-gray-800 dark:text-gray-200">{label}</span>
            <div
                className="flex-shrink-0 flex items-center min-w-[150px] justify-end space-x-2 group cursor-pointer"
                onClick={onClick}
            >
                {value && (
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline">
                        {value}
                    </span>
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </div>
    );
}
