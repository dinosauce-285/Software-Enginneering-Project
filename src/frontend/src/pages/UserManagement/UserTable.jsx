import { useState, useMemo } from 'react';
import { FiDownload, FiUserPlus, FiChevronLeft, FiChevronRight, FiMoreVertical } from "react-icons/fi";

const ITEMS_PER_PAGE = 8;

export default function UserTable({ users }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return users.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [users, currentPage]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allUserIds = paginatedUsers.map(user => user.id);
            setSelectedRows(allUserIds);
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };
    
    const isAllSelected = paginatedUsers.length > 0 && selectedRows.length === paginatedUsers.length;

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <div className="flex justify-between items-center shrink-0">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Users</h1>
                <div className="flex items-center gap-2">
                    <button className="bg-white dark:bg-gray-700/60 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <FiDownload />
                        <span>Export</span>
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
                        <FiUserPlus />
                        <span>New User</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-700/60 flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/50 z-10">
                            <tr>
                                <th className="p-4 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                        onChange={handleSelectAll}
                                        checked={isAllSelected}
                                    />
                                </th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">User</th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">Role</th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">Location</th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">Joined Date</th>
                                <th className="p-4 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                    <td className="p-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedRows.includes(user.id)}
                                            onChange={() => handleSelectRow(user.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                                                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                            
                                        <span className={`w-16 inline-flex justify-center items-center py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">{user.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(user.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiMoreVertical className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between shrink-0">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FiChevronLeft className="w-4 h-4" />Previous
                </button>
                <div className="flex items-center gap-1">
                    {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === currentPage ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{page}</button>
                    ))}
                </div>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next<FiChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}