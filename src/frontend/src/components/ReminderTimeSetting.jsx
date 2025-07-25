import React, { useState } from 'react';
import SettingRow from './SettingRow';

export default function ReminderTimeSetting() {
    const [reminderTime, setReminderTime] = useState("00:00"); // 8:00 PM mặc định
    const [showModal, setShowModal] = useState(false);
    const [newTime, setNewTime] = useState(reminderTime);
    const [error, setError] = useState("");

    const handleOpenModal = () => {
        setNewTime(reminderTime); // reset lại giá trị khi mở
        setError("");
        setShowModal(true);
    };

    const handleSave = () => {
        if (!newTime) {
            setError("Please select a time.");
            return;
        }
        setReminderTime(newTime);
        setShowModal(false);
    };

    const formatTime = (time24) => {
        if (!time24) return "";
        const [hour, minute] = time24.split(":");
        return `${hour}:${minute}`; // giữ nguyên định dạng 24h
    };

    return (
        <>
            <SettingRow
                label="Reminder Time"
                value={<span className="font-mono">{reminderTime}</span>}
                onClick={handleOpenModal}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md shadow max-w-md w-full">
                        <div className="w-full bg-orange-100 py-3 rounded-t-md flex justify-center">
                            <span className="text-orange-700 text-lg font-semibold">Change Reminder Time</span>
                        </div>
                        <div className="p-6">
                            <p className="mb-4">Choose your daily reminder time:</p>

                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-2"
                            />

                            {error && <p className="text-red-500 mb-2">⚠ {error}</p>}

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={handleSave}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
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

