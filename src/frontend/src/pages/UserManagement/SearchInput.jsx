import React from 'react';
import { FiSearch, FiX } from "react-icons/fi"; // Thêm FiX

export default function SearchInput({ filters, setFilters }) {
    
    const handleQueryChange = (e) => {
        setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    };

    const clearSearch = () => {
        setFilters(prev => ({ ...prev, searchQuery: '' }));
    };

    return (
        <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
            </label>
            <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <FiSearch className="w-4 h-4 text-gray-400" />
                </span>
                <input
                    type="text"
                    placeholder="Search by name, email..."
                    value={filters.searchQuery}
                    onChange={handleQueryChange}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition shadow-sm"
                />
                {/* Nút "X" chỉ hiển thị khi có nội dung tìm kiếm */}
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
    );
}