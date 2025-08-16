import React, { useState, useEffect } from 'react';
import { getProfile } from '../../services/api.js'; 
import SearchInput from '../UserManagement/SearchInput';
import ActionFilter from './ActionFilter';
import DateRangeFilter from './DateRangeFilter';

const AdminProfileSkeleton = () => (
    <div className="flex items-center gap-3 mb-8 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
    </div>
);

export default function ActivitySidebar({ filters, setFilters }) {
    const [adminProfile, setAdminProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const data = await getProfile();
                if (data && data.role === 'ADMIN') {
                    setAdminProfile(data);
                } else {
                    console.error("Access Denied: User is not an admin.");
                    setAdminProfile(null);
                }
            } catch (error) {
                console.error("Failed to fetch admin profile:", error);
                setAdminProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const getAvatarUrl = () => {
        if (adminProfile?.avatar) {
            return adminProfile.avatar;
        }
        const nameParam = encodeURIComponent(adminProfile?.display_name || 'Admin');
        return `https://ui-avatars.com/api/?name=${nameParam}&background=random`;
    };

    return (
        <aside className="w-72 bg-white dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700/60 p-6 flex flex-col shrink-0">
            {isLoading ? (
                <AdminProfileSkeleton />
            ) : adminProfile ? (
                <div className="flex items-center gap-3 mb-8">
                    <img
                        src={getAvatarUrl()}
                        alt={adminProfile.display_name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {adminProfile.display_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {adminProfile.role}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 mb-8">
                     <p className="text-sm text-red-500">Could not load admin info.</p>
                </div>
            )}
            
            <div className="space-y-6">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Filters</p>
                {/* <SearchInput filters={filters} setFilters={setFilters} /> */}
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