import React from 'react';
import SearchInput from '../UserManagement/SearchInput';
import ActionFilter from './ActionFilter';
import DateRangeFilter from './DateRangeFilter';

export default function ActivitySidebar({ filters, setFilters }) {
    return (
        <aside className="w-72 bg-white dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700/60 p-6 flex flex-col shrink-0">
            <div className="flex items-center gap-3 mb-8">
                 <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Activity Filters</p>
            </div>
            <div className="space-y-6">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Filters</p>
                <SearchInput filters={filters} setFilters={setFilters} />
                <ActionFilter filters={filters} setFilters={setFilters} />
                <DateRangeFilter 
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    setFilters={setFilters}
                />
            </div>
        </aside>
    );
}