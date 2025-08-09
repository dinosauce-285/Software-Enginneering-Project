import React, { useState } from 'react';
import SettingRow from './SettingRow';

const SuccessView = () => (
    <div className="p-6 flex flex-col items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Password Changed!
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your password has been updated successfully.
        </p>
    </div>
);

const FormView = ({ oldPassword, setOldPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, error }) => (
    <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Change Your Password
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            To protect your account, please choose a strong password.
        </p>
        <div className="space-y-4">
            <div>
                <label htmlFor="old-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Old Password</label>
                <input id="old-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4">⚠ {error}</p>}
    </div>
);

export default function ChangePasswordSetting() {
    const [showModal, setShowModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError("");
            setShowSuccess(false);
        }, 300);
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error("Authentication token not found.");
            
            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ oldPassword, newPassword }),
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
                label="Change Password"
                value="••••••••"
                onClick={() => setShowModal(true)}
            />
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full transform transition-all">
                        
                        {showSuccess ? <SuccessView /> : 
                            <FormView 
                                oldPassword={oldPassword}
                                setOldPassword={setOldPassword}
                                newPassword={newPassword}
                                setNewPassword={setNewPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
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
                                    <button onClick={handleChangePassword} disabled={loading} className="w-full px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-wait transition-colors">
                                        {loading ? "Saving..." : "Change Password"}
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