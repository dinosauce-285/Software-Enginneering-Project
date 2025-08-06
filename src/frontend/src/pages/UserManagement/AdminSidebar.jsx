import React from 'react';
import SearchInput from './SearchInput';
import PermissionFilter from './PermissionFilter';
import JoinedFilter from './JoinedFilter'; 
export default function AdminSidebar({ filters, setFilters }) {
    return (
        <aside className="w-72 bg-white dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700/60 p-6 flex flex-col shrink-0">
            <div className="flex items-center gap-3 mb-8">
                <img src="https://ui-avatars.com/api/?name=Huynh+Sinh&background=random" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Huynh Van Sinh</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Admin</p>
                </div>
            </div>
            <div className="space-y-6">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Filters</p>
        
                <SearchInput filters={filters} setFilters={setFilters} />
                <PermissionFilter filters={filters} setFilters={setFilters} />
                <JoinedFilter filters={filters} setFilters={setFilters} />
            </div>
        </aside>
    );
}