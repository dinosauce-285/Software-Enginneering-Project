import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import UserTable from './UserTable.jsx';
import { getAllUsers } from '../../services/api.js';
import { useDebounce } from '../../hooks/useDebounce.js';

import AdminMenu from '../../components/AdminMenu.jsx'; 

const PageLayout = ({ children }) => (
    <div className="absolute inset-0 flex flex-col bg-gray-50 dark:bg-gray-900">
        <header className="h-16 bg-white dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between px-6 lg:px-8 z-[9999] sticky top-0 shrink-0">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
                <img src="/src/assets/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    SoulNote<span className="text-blue-600">Admin</span>
                </span>
            </div>
            
            {/* Navigation Links */}
            <div className="flex-grow flex items-center justify-center gap-6 font-medium text-gray-700 dark:text-gray-300">
                <Link to="/user-management" className="font-semibold text-gray-900 dark:text-gray-100">User Management</Link>
                <Link to="/activity-logs" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Activity</Link>
            </div>

            <div className="flex items-center">
            
                <AdminMenu />
            </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
            {children}
        </div>
    </div>
);


export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ searchQuery: '', permission: 'All' });

    const debouncedSearchQuery = useDebounce(filters.searchQuery, 500);

    const fetchUsers = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                page,
                search: debouncedSearchQuery || undefined,
                role: filters.permission === 'All' ? undefined : filters.permission.toUpperCase(),
            };

            const response = await getAllUsers(params);

            const mappedUsers = response.data.map(user => ({
                id: user.userID,
                name: user.display_name,
                email: user.email,
                avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.display_name)}&background=random`,
                role: user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase(),
                location: 'N/A',
                joined: user.created_at,
            }));

            setUsers(mappedUsers);
            setPagination({ currentPage: response.page, totalPages: response.totalPages });
        } catch (err) {
            setError(err.message || 'Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchQuery, filters.permission]);

    useEffect(() => {
        fetchUsers(1);
    }, [debouncedSearchQuery, filters.permission, fetchUsers]); // Thêm fetchUsers vào dependency array

    const handlePageChange = (newPage) => {
        fetchUsers(newPage);
    };

    const handleActionComplete = () => {
        fetchUsers(pagination.currentPage);
    }

    return (
        <PageLayout>
            <AdminSidebar filters={filters} setFilters={setFilters} />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <UserTable
                    users={users}
                    isLoading={isLoading}
                    error={error}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onActionComplete={handleActionComplete}
                />
            </main>
        </PageLayout>
    );
}