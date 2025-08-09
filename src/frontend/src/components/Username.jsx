import React, { useState } from 'react';
import SettingRow from './SettingRow';
import { useAuth } from '../contexts/AuthContext';

const SuccessView = () => (
    <div className="p-6 flex flex-col items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Username Changed!
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your new username is now active.
        </p>
    </div>
);

const FormView = ({ canChange, daysLeft, newUsername, setNewUsername, error }) => (
    <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Change Username
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your public username can be changed once every 30 days.
        </p>
        {!canChange && (
            <div className="mb-4 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    You can change your username again in <strong>{daysLeft} day{daysLeft > 1 ? "s" : ""}</strong>.
                </p>
            </div>
        )}
        <div>
            <label htmlFor="new-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Username</label>
            <input
                id="new-username"
                type="text"
                placeholder="new_username_123"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                disabled={!canChange}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Must be 3-30 chars, using only a-z, 0-9, and underscore (_).
            </p>
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4">⚠ {error}</p>}
    </div>
);

export default function UsernameSetting() {
    const { user, changeUsername } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const lastChangedAt = user.usernameLastChangedAt ? new Date(user.usernameLastChangedAt).getTime() : 0;
    const canChange = !lastChangedAt || (Date.now() - lastChangedAt > thirtyDaysInMs);
    let daysLeft = 0;
    if (!canChange && lastChangedAt) {
        daysLeft = Math.ceil((thirtyDaysInMs - (Date.now() - lastChangedAt)) / (1000 * 60 * 60 * 24));
    }

    const handleConfirm = async () => {
        if (!canChange) return;
        if (!/^[a-z0-9_]{3,30}$/.test(newUsername)) {
            setError("Username must be 3-30 chars, using only a-z, 0-9, and underscore (_).");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await changeUsername(newUsername.trim());
            setShowSuccess(true);
        } catch (err) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setNewUsername("");
            setError("");
            setShowSuccess(false);
        }, 300);
    };

    return (
        <>
            <SettingRow
                label="Username"
                value={user?.display_name || "Not available"}
                onClick={() => setShowModal(true)}
            />
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full transform transition-all">
                        
                        {showSuccess ? <SuccessView /> : 
                            <FormView 
                                canChange={canChange}
                                daysLeft={daysLeft}
                                newUsername={newUsername}
                                setNewUsername={setNewUsername}
                                error={error}
                            />
                        }
                        
                        <div className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-b-2xl">
                            {showSuccess ? (
                                <button onClick={handleCloseModal} className="w-full px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                    Done
                                </button>
                            ) : (
                                <>
                                    <button onClick={handleCloseModal} className="w-full px-5 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={loading || !canChange}
                                        className="w-full px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? "Confirming..." : "Confirm"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}