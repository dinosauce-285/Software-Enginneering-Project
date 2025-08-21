import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';

export default function NavigationBar() {
    const navigate = useNavigate();
    const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);

    const notificationButtonRef = useRef(null);
    const notificationPanelRef = useRef(null);

    const handleLogoClick = () => {
        navigate('/dashboard');
    };

    const handleNotificationClick = () => {
        setNotificationPanelOpen(prev => !prev);
    };

    useEffect(() => {
        if (!isNotificationPanelOpen) return;

        function handleClickOutside(event) {
            if (
                (notificationButtonRef.current && notificationButtonRef.current.contains(event.target)) ||
                (notificationPanelRef.current && notificationPanelRef.current.contains(event.target))
            ) {
                return;
            }
            setNotificationPanelOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationPanelOpen]);

    // Thống nhất các class cho icon để dễ quản lý và thêm hiệu ứng
    // const iconClasses = "p-3 rounded-lg text-gray-600 transition-all duration-300 ease-in-out hover:bg-gray-100 hover:text-blue-600 hover:scale-110 hover:-translate-y-1";
    const iconClasses = "p-3 rounded-lg text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white hover:scale-110 hover:-translate-y-1";
    return (
        // <aside className="relative z-20 flex flex-col bg-white border-r shadow-md w-16 md:w-20 shrink-0">
        <aside className="relative z-20 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md w-16 md:w-20 shrink-0">
            <div className="flex items-center justify-center h-24 shrink-0">
                <img
                    src={logo}
                    alt="SoulNote Logo"
                    className="w-10 h-10 object-contain cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-100"
                    onClick={handleLogoClick}
                />
            </div>
            <div className="flex flex-col items-center mt-[7rem] flex-grow space-y-10">
                <Link to="/create-memory" className={iconClasses}>
                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </Link>
                <Link to="/report" className={iconClasses}>
                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                    </svg>
                </Link>
                <button
                    ref={notificationButtonRef}
                    onClick={handleNotificationClick}
                    className={iconClasses}
                    aria-label="Notifications"
                >
                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                </button>
            </div>
            <div
                ref={notificationPanelRef}
                className={`
                    absolute top-0 left-16 md:left-20 h-full
                    transition-all duration-300 ease-in-out
                    ${isNotificationPanelOpen ? 'transform opacity-100' : 'transform opacity-0 -translate-x-4 pointer-events-none'}
                `}
            >
                <NotificationPanel />
            </div>
        </aside>
    );
}