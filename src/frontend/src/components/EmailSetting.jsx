import React, { useState, useEffect } from 'react';
import SettingRow from './SettingRow';

const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return null;
    }
};

const SuccessView = ({ email }) => (
    <div className="p-6 flex flex-col items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Confirmation Required
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            We've sent a confirmation link to <strong>{email}</strong>. Please check your inbox to complete the change.
        </p>
    </div>
);

const FormView = ({ newEmail, setNewEmail, password, setPassword, error }) => (
    <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Change Login Email
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Enter your new email and current password to update your account.
        </p>
        <div className="space-y-4">
            <div>
                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Email Address</label>
                <input id="new-email" type="email" placeholder="you@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <input id="current-password" type="password" placeholder="Enter your password to confirm" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4">⚠ {error}</p>}
    </div>
);

export default function EmailSetting() {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [showModal, setShowModal] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setNewEmail("");
            setPassword("");
            setError("");
            setShowSuccess(false);
        }, 300);
    };

    const handleChangeEmail = async () => {
        if (!newEmail || !password) {
            setError("Please provide the new email and your current password.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error("Authentication token not found.");

            const response = await fetch(`${API_BASE_URL}/auth/change-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ newEmail, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An unknown error occurred.');
            
            setShowSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SettingRow
                label="Email"
                value={currentUser?.email || "No email found"}
                onClick={() => setShowModal(true)}
            />
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full transform transition-all">
                        
                        {showSuccess ? <SuccessView email={newEmail} /> : 
                            <FormView 
                                newEmail={newEmail}
                                setNewEmail={setNewEmail}
                                password={password}
                                setPassword={setPassword}
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
                                    <button onClick={handleChangeEmail} disabled={loading} className="w-full px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-wait transition-colors">
                                        {loading ? "Saving..." : "Save Changes"}
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