import React, { useState } from 'react';
import SettingRow from './SettingRow';

export default function UsernameSetting() {
    const [username, setUsername] = useState("vannguyen123");
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [lastChangedAt, setLastChangedAt] = useState(Date.now() - 20 * 24 * 60 * 60 * 1000);

    const isValidUsername = (name) => /^[a-z0-9_]{3,30}$/.test(name);

    const handleConfirm = async () => {
        if (!newUsername.trim()) {
            setError("Please enter a new username.");
            return;
        }
        if (!isValidUsername(newUsername.trim())) {
            setError("Username must be 3–30 characters, only a–z, 0–9, and underscore.");
            return;
        }
        const now = Date.now();
        if (now - lastChangedAt < 30 * 24 * 60 * 60 * 1000) {
            setError("You can only change your username once every 30 days.");
            return;
        }

        setLoading(true);
        setError("");

        try {

            const res = await fetch('/api/replace-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newUsername: newUsername.trim() }),
            });
            const data = await res.json();

            if (res.ok) {
                setUsername(newUsername.trim());
                setLastChangedAt(now); 
                setShowModal(false);
                setNewUsername("");
                alert("Username changed successfully!");
            } else {
                setError(data.message || "Username already exists or is not allowed.");
            }
        } catch (err) {
            setError("Server error, please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewUsername("");
        setError("");
    };

    // Tính số ngày còn lại
    const now = Date.now();
    const daysLeft = Math.ceil((30 * 24 * 60 * 60 * 1000 - (now - lastChangedAt)) / (24 * 60 * 60 * 1000));
    const canChange = now - lastChangedAt >= 30 * 24 * 60 * 60 * 1000;

    return (
        <>
            <SettingRow
                label="Username"
                value={username}
                onClick={() => setShowModal(true)}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md shadow max-w-md w-full">
                        <div className="w-full bg-orange-100 py-3 rounded-t-md flex justify-center">
                            <span className="text-orange-700 text-lg font-semibold">Change Username</span>
                        </div>
                        <div className="p-6">
                            {!canChange && (
                                <p className="text-red-600 mb-2">
                                    ⚠ You can only change your username once every 30 days. Please wait {daysLeft} more day{daysLeft > 1 ? "s" : ""}.
                                </p>
                            )}
                            <p className="mb-4">Enter a new username to replace the old one:</p>
                            <input
                                type="text"
                                placeholder="Enter new username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-2"
                            />
                            {error && <p className="text-red-500 mb-2">{error}</p>}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading || !canChange}
                                    className={`px-4 py-2 rounded text-white ${loading || !canChange ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                                        }`}
                                >
                                    {loading ? "Processing..." : "Confirm"}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
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
