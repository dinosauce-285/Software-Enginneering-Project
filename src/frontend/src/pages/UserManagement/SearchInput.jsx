import React from 'react';
import { FiSearch } from "react-icons/fi";

export default function SearchInput({ filters, setFilters }) {
    
    const handleQueryChange = (e) => {
        setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    };
    return (
        <div>
            <label htmlFor="search-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
            </label>
            <div className="mt-1 flex items-center w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                <div className="pl-3.5 pr-2 shrink-0">
                    <FiSearch className="text-gray-400" />
                </div>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search by name, email..."
                    value={filters.searchQuery}
                    onChange={handleQueryChange}
                    className="flex-grow bg-transparent py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400/70"
                />
            </div>
        </div>
    );
}