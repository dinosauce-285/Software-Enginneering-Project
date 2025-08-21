import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReminders, markReminderAsRead } from '../services/api';
import { formatDistanceToNow } from 'date-fns';


const LoadingState = () => (
    <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>
);


const EmptyState = () => (
    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        You're all caught up.
    </div>
);

export default function NotificationPanel() {
    const [reminders, setReminders] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const data = await getReminders();
                setReminders(data);
                if (error) setError(null);
            } catch (err) {
                console.error("Failed to fetch reminders:", err);
                setError("Could not load your reminders.");
            } finally {
                if (isInitialLoading) {
                    setIsInitialLoading(false);
                }
            }
        };
        fetchReminders();
        const intervalId = setInterval(fetchReminders, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const handleReminderClick = async (reminder) => {
        if (!reminder.isRead) {
            try {
                await markReminderAsRead(reminder.reminderID);
                setReminders(currentReminders =>
                    currentReminders.map(r =>
                        r.reminderID === reminder.reminderID ? { ...r, isRead: true } : r
                    )
                );
            } catch (err) {
                console.error("Failed to mark reminder as read:", err);
            }
        }
        navigate('/create-memory');
    };

    const renderContent = () => {
        if (isInitialLoading) return <LoadingState />;
        if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
        if (reminders.length === 0) return <EmptyState />;

        return (
            <ul>
                {reminders.map((reminder) => (
                    <li
                        key={reminder.reminderID}
                        onClick={() => handleReminderClick(reminder)}
                        className={`p-4 border-b transition cursor-pointer 
                            ${!reminder.isRead ? 'bg-blue-50 dark:bg-gray-700/50' : ''} 
                            hover:bg-gray-50 dark:hover:bg-gray-700
                            border-gray-100 dark:border-gray-700
                        `}
                    >
                        <p className={`text-sm 
                            ${!reminder.isRead ? 'font-semibold' : ''}
                            text-gray-700 dark:text-gray-200
                        `}>
                            {reminder.content}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(reminder.createdAt), { addSuffix: true })}
                        </p>
                    </li>
                ))}
            </ul>
        );
    };

    return (

        <div className="absolute top-0 left-full ml-4 h-full w-96 flex flex-col 
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            rounded-lg shadow-lg z-50"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Reminders</h3>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
}