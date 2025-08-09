// src/components/SettingRow.jsx

import React from 'react';

export default function SettingRow({ label, value, onClick, children }) {
    const isClickable = !!onClick;

    const content = (
        <div className="flex w-full items-center justify-between px-4 py-3 min-h-[52px]">
            <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
            
            {children ? (
                <div className="flex-shrink-0">{children}</div>
            ) : (
                <div className="flex items-center space-x-3">
                    {value && (
                        <span className="text-gray-500 dark:text-gray-400">
                            {value}
                        </span>
                    )}
                    {isClickable && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5 text-gray-400 dark:text-gray-500"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    )}
                </div>
            )}
        </div>
    );

    if (isClickable) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="w-full text-left transition-colors duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700/60"
            >
                {content}
            </button>
        );
    }

    return content;
}