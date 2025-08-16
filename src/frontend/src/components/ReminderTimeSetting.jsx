

import React, { useState, useCallback, useEffect } from 'react';
import SettingRow from './SettingRow';
import TimeWheelPicker from './TimeWheelPicker';
import { getUserSettings, updateUserSettings } from '../services/api';

export default function ReminderTimeSetting() {
    const [reminderTime, setReminderTime] = useState("Loading...");
    const [showModal, setShowModal] = useState(false);
    const [tempTime, setTempTime] = useState({ hour: 9, minute: 0 });
    const [isSaving, setIsSaving] = useState(false);

    const padZero = (num) => String(num).padStart(2, '0');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getUserSettings();
                if (settings && settings.reminderTime) {
                    const [hour, minute] = settings.reminderTime.split(':').map(Number);
                    setReminderTime(settings.reminderTime);
                    setTempTime({ hour, minute });
                }
            } catch (error) {
                console.error("Failed to fetch user settings:", error);
                setReminderTime("Unavailable");
            }
        };
        fetchSettings();
    }, []);

    const handleOpenModal = () => {
        const [hour, minute] = reminderTime.split(':').map(Number);
        setTempTime({ hour, minute });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSave = async () => {
        const newTime = `${padZero(tempTime.hour)}:${padZero(tempTime.minute)}`;
        setIsSaving(true);

        try {
            await updateUserSettings({ reminderTime: newTime });
            setReminderTime(newTime);
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save reminder time:", error);
            alert("Could not save your new reminder time. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleTimeChange = useCallback((newTime) => {
        setTempTime(newTime);
    }, []);

    const handleInputChange = (field, value) => {
        let num = parseInt(value, 10);
        if (isNaN(num)) num = 0;

        if (field === "hour") {
            num = Math.max(0, Math.min(23, num)); // Giới hạn 0–23
        } else {
            num = Math.max(0, Math.min(59, num)); // Giới hạn 0–59
        }

        setTempTime((prev) => ({ ...prev, [field]: num }));
    };

    return (
        <>
            <SettingRow
                label="Reminder Time"
                value={<span className="font-mono">{reminderTime}</span>}
                onClick={handleOpenModal}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full transform transition-all">
                        <div className="p-6 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Reminder Time
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Choose a time for your daily notification.
                            </p>

                            {/* Cho phép lăn chọn giờ/phút */}
                            <TimeWheelPicker
                                initialTime={reminderTime}
                                onTimeChange={handleTimeChange}
                            />

                            {/* Thêm ô nhập trực tiếp */}
                            <div className="flex justify-center gap-2 mt-4">
                                <input
                                    type="number"
                                    value={tempTime.hour}
                                    onChange={(e) => handleInputChange("hour", e.target.value)}
                                    min="0"
                                    max="23"
                                    className="w-16 px-2 py-1 text-center border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                                <span className="text-lg font-bold">:</span>
                                <input
                                    type="number"
                                    value={tempTime.minute}
                                    onChange={(e) => handleInputChange("minute", e.target.value)}
                                    min="0"
                                    max="59"
                                    className="w-16 px-2 py-1 text-center border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-b-2xl">
                            <button
                                onClick={handleCloseModal}
                                className="w-full px-5 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
