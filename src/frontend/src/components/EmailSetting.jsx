// src/components/EmailSetting.jsx
import React, { useState } from 'react';
import SettingRow from './SettingRow';

export default function EmailSetting() {
    const [emails, setEmails] = useState(["nguyentanvan123@gmail.com"]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    const handleDeleteEmail = () => {
        if (emails.length <= 1) {
            setError("You must have at least one email.");
        } else {
            setEmails(emails.slice(0, -1));
            setShowModal(false);
            setError("");
        }
    };

    return (
        <>
            <SettingRow
                label="Email"
                value={emails[0]}
                onClick={() => setShowModal(true)}
            />

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Manage Email</h3>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={handleDeleteEmail}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => alert('Add email logic (coming soon)')}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => { setShowModal(false); setError(""); }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
