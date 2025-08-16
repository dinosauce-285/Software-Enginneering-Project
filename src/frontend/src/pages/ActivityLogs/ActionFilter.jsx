import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

const actionOptions = [
    'All', 'Login', 'Created memory', 'Edited memory', 
    'Deleted memory', 'Shared memory', 'Changed password', 
    'Updated profile info', 'Deleted account'
];

export default function ActionFilter({ filters, setFilters }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (action) => {
        setFilters(prev => ({ ...prev, action }));
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    };

    const clearSearch = () => {
        setFilters(prev => ({ ...prev, searchQuery: '' }));
    };
    return (
        // Sử dụng Fragment để trả về cả hai bộ lọc mà không cần thêm thẻ div bọc ngoài
        <>
            {/* PHẦN TÌM KIẾM ĐƯỢC THÊM VÀO */}
            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiSearch className="w-4 h-4 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={filters.searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition shadow-sm"
                    />
                    {filters.searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 group"
                            aria-label="Clear search"
                        >
                            <FiX className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                        </button>
                    )}
                </div>
            </div>

            {/* PHẦN LỌC HÀNH ĐỘNG GỐC */}
            <div className="relative" ref={dropdownRef}>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="mt-1 flex items-center justify-between w-full pl-3.5 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition shadow-sm"
                >
                    <span>{filters.action}</span>
                    <span className={`inline-block transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                    </span>
                </button>
                {isOpen && (
                    <div className="absolute z-10 mt-2 w-full origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                        <div className="p-1">
                            {actionOptions.map(option => (
                                <button
                                    key={option}
                                    className="block text-left w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}