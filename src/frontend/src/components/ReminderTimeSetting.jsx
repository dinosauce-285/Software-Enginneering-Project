import React, { useState, useCallback } from 'react';
import SettingRow from './SettingRow';
import TimeWheelPicker from './TimeWheelPicker';

export default function ReminderTimeSetting() {
    const [reminderTime, setReminderTime] = useState("09:00");
    const [showModal, setShowModal] = useState(false);
    
    const [tempTime, setTempTime] = useState({ hour: 9, minute: 0 });

    const padZero = (num) => String(num).padStart(2, '0');

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSave = () => {
        const newTime = `${padZero(tempTime.hour)}:${padZero(tempTime.minute)}`;
        setReminderTime(newTime);
        handleCloseModal();
    };

    const handleTimeChange = useCallback((newTime) => {
        setTempTime(newTime);
    }, []);

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
                            
                            <TimeWheelPicker 
                                initialTime={reminderTime}
                                onTimeChange={handleTimeChange}
                            />
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