
import React, { useState } from 'react';
import SettingRow from './SettingRow';
import { useAuth } from '../contexts/AuthContext';

export default function UsernameSetting() {

    const { user, changeUsername } = useAuth();
    // State cho modal và form
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    // --- LOGIC 30 NGÀY DỰA TRÊN DỮ LIỆU THẬT TỪ BACKEND ---
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    // Sử dụng optional chaining `?.` để an toàn nếu user chưa được tải
    const lastChangedAt = user.usernameLastChangedAt ? new Date(user.usernameLastChangedAt).getTime() : 0;
    const canChange = !lastChangedAt || (Date.now() - lastChangedAt > thirtyDaysInMs);
    let daysLeft = 0;
    if (!canChange && lastChangedAt) {
        daysLeft = Math.ceil((thirtyDaysInMs - (Date.now() - lastChangedAt)) / (1000 * 60 * 60 * 24));
    }
    // --- KẾT THÚC LOGIC 30 NGÀY ---

    const handleConfirm = async () => {
        // Kiểm tra định dạng ở client để có phản hồi nhanh
        if (!/^[a-z0-9_]{3,30}$/.test(newUsername)) {
            setError("Username must be 3-30 chars, using only a-z, 0-9, and underscore (_).");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await changeUsername(newUsername.trim());
            alert("Username changed successfully!");
            setShowModal(false);
            setNewUsername("");
        } catch (err) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewUsername("");
        setError("");
    };

    return (
        <>
            <SettingRow
                label="Username"
                value={user?.display_name || "Not available"}
                onClick={() => setShowModal(true)}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md shadow dark:bg-gray-800 max-w-md w-full">
                        <div className="w-full bg-orange-100 dark:bg-orange-900/40 py-3 rounded-t-md flex justify-center">
                            <span className="text-orange-700 dark:text-orange-300 text-lg font-semibold">Change Username</span>
                        </div>
                        <div className="p-6">
                            {!canChange && (
                                <p className="text-sm text-center font-semibold dark:text-red-400 text-red-600 bg-red-100 dark:bg-red-900/40 p-2 rounded-md mb-4">
                                    You can change your username again in {daysLeft} day{daysLeft > 1 ? "s" : ""}.
                                </p>
                            )}
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Your username must be 3-30 characters long and can only contain lowercase letters (a-z), numbers (0-9), and underscores (_).</p>
                            <input
                                type="text"
                                placeholder="Enter new username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {error && <p className="text-red-500 dark:text-red-400  mb-2">⚠ {error}</p>}
                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading || !canChange}
                                    className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : "Confirm"}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
