import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import ActivitySidebar from './ActivitySidebar';
import ActivityTable from './ActivityTable';
import AdminMenu from '../../components/AdminMenu';
import { getActivityLogs } from '../../services/api';

export default function ActivityLogsPage() {
    const [filters, setFilters] = useState({
        searchQuery: '',
        action: 'All',
        startDate: null,
        endDate: null,
    });

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        getActivityLogs()
            .then(setLogs)
            .catch((err) => console.error('Failed to fetch logs:', err));
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            if (filters.action !== 'All' && log.action !== filters.action) return false;

            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                if (
                    !log.name.toLowerCase().includes(query) &&
                    !log.email.toLowerCase().includes(query)
                ) return false;
            }

            const logDate = new Date(log.date);
            if (filters.startDate && logDate < filters.startDate) return false;
            if (filters.endDate) {
                const inclusiveEndDate = new Date(filters.endDate);
                inclusiveEndDate.setHours(23, 59, 59, 999);
                if (logDate > inclusiveEndDate) return false;
            }

            return true;
        });
    }, [logs, filters]);

    const linkStyle = ({ isActive }) =>
        `transition-colors ${isActive
            ? 'font-semibold text-gray-900 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`;

    return (
        <div className="absolute inset-0 flex flex-col bg-gray-50 dark:bg-gray-900">
            <header className="h-16 bg-white dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between px-6 lg:px-8 z-[9999] sticky top-0 shrink-0">
                <div className="flex items-center gap-3">
                    <img src="/src/assets/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        SoulNote<span className="text-blue-600">Admin</span>
                    </span>
                </div>

                <div className="flex items-center gap-6 font-medium text-gray-700 dark:text-gray-300">
                    <NavLink to="/user-management" className={linkStyle}>
                        User Management
                    </NavLink>
                    <NavLink to="/activity-logs" className={linkStyle}>
                        Activity
                    </NavLink>
                </div>

                <div className="ml-6 relative z-[9999]">
                    <AdminMenu />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <ActivitySidebar filters={filters} setFilters={setFilters} />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <ActivityTable logs={filteredLogs} />
                </main>
            </div>
        </div>
    );
}