import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import UserTable from './UserTable.jsx';

const mockUsers = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: ['Le Quang Nguyen', 'Pham Thinh Quang', 'Thanh Quoc Ly', 'Van Sinh Huynh', 'Tan Van Nguyen', 'Cristiano Ronaldo', 'Kylian Mbappe', 'Lamine Yamal', 'John Doe', 'Jane Smith', 'Peter Jones', 'Mary Williams'][i] || `User ${i + 1}`,
    email: `user${i + 1}@soulnote.app`,
    location: ['Los Angeles, CA', 'Cheyenne, WY', 'Syracuse, NY', 'Luanda, AN', 'Lagos, NG', 'London, UK', 'Paris, FR', 'Barcelona, ES', 'Tokyo, JP', 'Sydney, AU', 'Berlin, DE', 'Moscow, RU'][i] || 'Unknown',
    joined: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    role: i < 4 ? 'Admin' : 'User',
    avatar: `https://ui-avatars.com/api/?name=${['Le+Quang+Nguyen', 'Pham+Thinh+Quang', 'Thanh+Quoc+Ly', 'Van+Sinh+Huynh', 'Tan+Van+Nguyen', 'Cristiano+Ronaldo', 'Kylian+Mbappe', 'Lamine+Yamal', 'John+Doe', 'Jane+Smith', 'Peter+Jones', 'Mary+Williams'][i] || `User${i+1}`}&background=random`,
}));

const PageLayout = ({ children }) => (
    <div className="absolute inset-0 flex flex-col bg-gray-50 dark:bg-gray-900">
        <header className="h-16 bg-white dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between px-6 lg:px-8 z-10 sticky top-0 shrink-0">
            <div className="flex items-center gap-3">
                <img src="/src/assets/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">SoulNote<span className="text-blue-600">Admin</span></span>
            </div>
            <div className="flex items-center gap-6 font-medium text-gray-700 dark:text-gray-300">
                <Link to="/user-management" className="font-semibold text-gray-900 dark:text-gray-100">User Management</Link>
                <Link to="/activity-logs" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Activity</Link>
            </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
            {children}
        </div>
    </div>
);

export default function AdminUsersPage() {
    const [filters, setFilters] = useState({
        searchQuery: '',
        permission: 'All',
        joinedStartDate: null,
        joinedEndDate: null,
    });

    const filteredUsers = useMemo(() => {
        return mockUsers.filter(user => {
            if (filters.permission !== 'All' && user.role !== filters.permission) return false;
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                if (!user.name.toLowerCase().includes(query) && !user.email.toLowerCase().includes(query)) return false;
            }

            const userJoinedDate = new Date(user.joined);
            userJoinedDate.setHours(0, 0, 0, 0);

            if (filters.joinedStartDate && userJoinedDate < filters.joinedStartDate) {
                return false;
            }
            if (filters.joinedEndDate) {
                const inclusiveEndDate = new Date(filters.joinedEndDate);
                inclusiveEndDate.setHours(23, 59, 59, 999);
                if (userJoinedDate > inclusiveEndDate) return false;
            }

            return true;
        });
    }, [filters]);

    return (
        <PageLayout>
            <AdminSidebar filters={filters} setFilters={setFilters} />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <UserTable users={filteredUsers} />
            </main>
        </PageLayout>
    );
}