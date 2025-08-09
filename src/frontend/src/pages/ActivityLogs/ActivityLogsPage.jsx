// import React, { useState, useMemo } from 'react';
// import { NavLink } from 'react-router-dom';
// import ActivitySidebar from './ActivitySidebar';
// import ActivityTable from './ActivityTable';
// import UserMenu from '../../components/UserMenu';

// const names = [
//     'Nguyen Le Quang', 'Pham Quang Thinh', 'Ly Quoc Thanh', 'Huynh Van Sinh',
//     'Nguyen Tan Van', 'Cristiano Ronaldo', 'Kylian Mbappe', 'Lamine Yamal', 'Erling Haaland'
// ];

// const mockLogs = Array.from({ length: names.length }, (_, i) => {
//     const name = names[i];
//     const emailInitial = name.split(' ').map(n => n[0]).join('').toLowerCase();

//     const avatarUrlName = name.replace(/ /g, '+');

//     return {
//         id: i + 1,
//         name: name,
//         email: `${emailInitial}@gmail.com`,
//         action: ['Login', 'Created memory', 'Edited memory', 'Deleted memory', 'Shared memory', 'Changed password', 'Updated profile info', 'Deleted account', 'Login'][i],
//         target: ['–', 'Trip to Đà Lạt', 'Birthday 2025', 'Training Day', 'Public game project...', '–', '–', '–', '–'][i],
//         date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
//         avatar: `https://ui-avatars.com/api/?name=${avatarUrlName}&background=random&font-size=0.33`,
//     };
// });


// export default function ActivityLogsPage() {
//     const [filters, setFilters] = useState({
//         searchQuery: '',
//         action: 'All',
//         startDate: null,
//         endDate: null,
//     });

//     const filteredLogs = useMemo(() => {
//         return mockLogs.filter(log => {
//             if (filters.action !== 'All' && log.action !== filters.action) {
//                 return false;
//             }
//             if (filters.searchQuery) {
//                 const query = filters.searchQuery.toLowerCase();
//                 if (!log.name.toLowerCase().includes(query) && !log.email.toLowerCase().includes(query)) {
//                     return false;
//                 }
//             }
//             const logDate = new Date(log.date);
//             if (filters.startDate && logDate < filters.startDate) {
//                 return false;
//             }
//             if (filters.endDate) {
//                 const inclusiveEndDate = new Date(filters.endDate);
//                 inclusiveEndDate.setHours(23, 59, 59, 999);
//                 if (logDate > inclusiveEndDate) return false;
//             }
//             return true;
//         });
//     }, [filters]);

//     const linkStyle = ({ isActive }) =>
//         `transition-colors ${isActive
//             ? 'font-semibold text-gray-900 dark:text-gray-100'
//             : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
//         }`;

//     return (
//         <div className="absolute inset-0 flex flex-col bg-gray-50 dark:bg-gray-900">
//             {/* <header className="h-16 bg-white dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between px-6 lg:px-8 z-[9999] sticky top-0 shrink-0">
//                 <div className="flex items-center gap-3">
//                     <img src="/src/assets/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
//                     <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">SoulNote<span className="text-blue-600">Admin</span></span>
//                 </div>
//                 <div className="flex items-center gap-6 font-medium text-gray-700 dark:text-gray-300">
//                     <NavLink to="/user-management" className={linkStyle}>
//                         User Management
//                     </NavLink>
//                     <NavLink to="/activity-logs" className={linkStyle}>
//                         Activity
//                     </NavLink>
//                 </div>
//             </header> */}
//             <header className="h-16 bg-white dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between px-6 lg:px-8 z-[9999] sticky top-0 shrink-0">
//                 {/* Logo + Tên */}
//                 <div className="flex items-center gap-3">
//                     <img src="/src/assets/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
//                     <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                         SoulNote<span className="text-blue-600">Admin</span>
//                     </span>
//                 </div>

//                 {/* Menu giữa */}
//                 <div className="flex items-center gap-6 font-medium text-gray-700 dark:text-gray-300">
//                     <NavLink to="/user-management" className={linkStyle}>
//                         User Management
//                     </NavLink>
//                     <NavLink to="/activity-logs" className={linkStyle}>
//                         Activity
//                     </NavLink>
//                 </div>

//                 {/* Thêm UserMenu ở bên phải */}
//                 <div className="ml-6 relative z-[9999]">
//                     <UserMenu />
//                 </div>
//             </header>
//             <div className="flex flex-1 overflow-hidden">
//                 <ActivitySidebar filters={filters} setFilters={setFilters} />
//                 <main className="flex-1 p-6 md:p-8 overflow-y-auto">
//                     <ActivityTable logs={filteredLogs} />
//                 </main>
//             </div>
//         </div>


//     );
// }


import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import ActivitySidebar from './ActivitySidebar';
import ActivityTable from './ActivityTable';
import UserMenu from '../../components/UserMenu';

// ✅ Thêm import hàm fetch API
import { getActivityLogs } from '../../services/api'; // Đảm bảo có file này nhé

export default function ActivityLogsPage() {
    const [filters, setFilters] = useState({
        searchQuery: '',
        action: 'All',
        startDate: null,
        endDate: null,
    });

    // ✅ State để lưu logs từ API
    const [logs, setLogs] = useState([]);

    // ✅ Fetch logs từ backend khi load
    useEffect(() => {
        getActivityLogs()
            .then(setLogs)
            .catch((err) => console.error('Failed to fetch logs:', err));
    }, []);

    // ✅ Lọc dữ liệu theo filters
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
                    <UserMenu />
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


