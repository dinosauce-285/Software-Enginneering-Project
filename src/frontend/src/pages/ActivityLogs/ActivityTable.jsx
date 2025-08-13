import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 8;

export default function ActivityTable({ logs }) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => Math.ceil(logs.length / ITEMS_PER_PAGE), [logs]);

    const paginatedLogs = useMemo(() => {

        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return logs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [logs, currentPage, totalPages]);

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Activities</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-700/60 flex-1 flex flex-col overflow-visible">
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/50 z-0">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">User</th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">Action</th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">Target</th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={log.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(log.name)}&background=random`}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{log.name}</p>
                                                <p className="text-gray-500 dark:text-gray-400">{log.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{log.action}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{log.target}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{format(new Date(log.date), 'd MMM, yyyy - HH:mm')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between shrink-0">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiChevronLeft className="w-4 h-4" />Previous
                </button>
                <div className="flex items-center gap-1">
                    {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === currentPage ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next<FiChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}