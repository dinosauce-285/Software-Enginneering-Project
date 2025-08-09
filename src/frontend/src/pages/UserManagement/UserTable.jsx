import React, { useState, useRef, useEffect } from 'react';
import { FiDownload, FiChevronLeft, FiChevronRight, FiMoreVertical, FiTrash2, FiEdit } from "react-icons/fi";
import { deleteUser, updateUserRole } from '../../services/api';

const EditRoleModal = ({ user, onClose, onActionComplete }) => {
    const [selectedRole, setSelectedRole] = useState(user.role.toUpperCase());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (showSuccess) return;
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose, showSuccess]);


    const handleSave = async () => {
        setIsLoading(true);
        setError('');
        try {
            await updateUserRole(user.id, selectedRole);
            setShowSuccess(true);
        } catch (err) {
            setError(err.message || "Failed to update role.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        onActionComplete();
        onClose();
    }

    const FormView = () => (
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Change Role for {user.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Select the new role for this user. This will change their permissions immediately.
            </p>
            <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input type="radio" name="role" value="USER" checked={selectedRole === 'USER'} onChange={(e) => setSelectedRole(e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">User</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input type="radio" name="role" value="ADMIN" checked={selectedRole === 'ADMIN'} onChange={(e) => setSelectedRole(e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Admin</span>
                </label>
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4">⚠ {error}</p>}
        </div>
    );

    const SuccessView = () => (
        <div className="p-6 flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                Role Updated!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                The user's role has been changed successfully.
            </p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full transform transition-all">
                {showSuccess ? <SuccessView /> : <FormView />}
                <div className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-b-2xl">
                    {showSuccess ? (
                        <button onClick={handleFinish} className="w-full px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                            Done
                        </button>
                    ) : (
                        <>
                            <button onClick={onClose} className="w-full px-5 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={isLoading} className="w-full px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-wait transition-colors">
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


export default function UserTable({ users, isLoading, error, pagination, onPageChange, onActionComplete }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const menuRef = useRef(null);
    const { currentPage, totalPages } = pagination;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedRows([]);
        setOpenMenuId(null);
    }, [users]);

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
            try {
                await deleteUser(userId);
                onActionComplete();
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    const handleDeleteSelected = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected user(s)?`)) {
            try {
                await Promise.all(selectedRows.map(id => deleteUser(id)));
                setSelectedRows([]);
                onActionComplete();
            } catch (err) {
                alert(`An error occurred while deleting users: ${err.message}`);
            }
        }
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedRows(users.map(user => user.id));
        else setSelectedRows([]);
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const isAllSelected = !isLoading && users.length > 0 && selectedRows.length === users.length;

    return (
        <div className="w-full h-full flex flex-col gap-6">
            {editingUser && <EditRoleModal user={editingUser} onClose={() => setEditingUser(null)} onActionComplete={onActionComplete} />}

            <div className="flex justify-between items-center shrink-0">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Users</h1>
                <div className="flex items-center gap-2">

                    {selectedRows.length > 0 && (
                        <button onClick={handleDeleteSelected} className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-red-700 transition shadow-sm">
                            <FiTrash2 />
                            <span>Delete ({selectedRows.length})</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-700/60 flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/50 z-10">

                            <tr>
                                <th className="p-4 w-12 text-center">
                                    <input type="checkbox" onChange={handleSelectAll} checked={isAllSelected} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">User</th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">Role</th>
                                <th className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">Joined Date</th>
                                <th className="p-4 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                            {isLoading ? (<tr><td colSpan="6" className="text-center p-8 text-gray-500">Loading users...</td></tr>)
                                : error ? (<tr><td colSpan="6" className="text-center p-8 text-red-500">{error}</td></tr>)
                                    : users.length === 0 ? (<tr><td colSpan="6" className="text-center p-8 text-gray-500">No users found.</td></tr>)
                                        : (
                                            users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                                    <td className="p-4 text-center">
                                                        <input type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => handleSelectRow(user.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                                            <div>
                                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                                                                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`w-16 inline-flex justify-center items-center py-1 rounded-full text-xs font-semibold capitalize ${user.role.toLowerCase() === 'admin' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(user.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                    <td className="px-6 py-4 text-right relative">
                                                        <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            <FiMoreVertical className="w-5 h-5" />
                                                        </button>
                                                        {openMenuId === user.id && (
                                                            <div ref={menuRef} className="absolute right-8 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-20">
                                                                <ul className="py-1">
                                                                    <li>
                                                                        <button onClick={() => { setEditingUser(user); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            <FiEdit className="w-4 h-4" />
                                                                            <span>Edit Role</span>
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button onClick={() => { handleDeleteUser(user.id, user.name); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            <FiTrash2 className="w-4 h-4" />
                                                                            <span>Delete User</span>
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between shrink-0">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiChevronLeft className="w-4 h-4" />Previous
                </button>
                <div className="flex items-center gap-1">
                    {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => onPageChange(page)} disabled={isLoading} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === currentPage ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{page}</button>
                    ))}
                </div>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next<FiChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}