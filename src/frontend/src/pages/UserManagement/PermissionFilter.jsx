import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from "react-icons/fi";

const permissionOptions = [
    { key: 'All', label: 'All' },
    { key: 'Admin', label: 'Admin' },
    { key: 'User', label: 'User' },
];

export default function PermissionFilter({ filters, setFilters }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (permissionKey) => {
        setFilters(prev => ({ ...prev, permission: permissionKey }));
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Permission
            </label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 flex items-center justify-between w-full pl-3.5 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition shadow-sm"
            >
                <span className="capitalize">{filters.permission}</span>
                
                <span 
                    className={`
                        inline-block transition-transform duration-300 ease-in-out
                        ${isOpen ? 'rotate-180' : 'rotate-0'}
                    `}
                >
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                </span>
                
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-1">
                        {permissionOptions.map(option => (
                            <button
                                key={option.key}
                                className="block text-left w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSelect(option.key)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}