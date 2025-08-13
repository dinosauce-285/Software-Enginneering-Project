// pages/AdminSettings/index.jsx

import React from 'react';
import { Link } from 'react-router-dom';


import SettingsGroup from '../../components/SettingsGroup';
import EmailSetting from '../../components/EmailSetting';
import UsernameSetting from '../../components/Username';
import ChangePasswordSetting from '../../components/ChangePasswordSetting';
import ThemeSetting from '../../components/ThemeSetting';

export default function AdminSettings() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Admin Settings
                    </h1>
                </header>

                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Account
                    </h2>
                    <div className="mt-3 bg-white dark:bg-slate-800 shadow sm:rounded-lg overflow-hidden">
                        <SettingsGroup>
                            <EmailSetting />
                            <UsernameSetting />
                            <ChangePasswordSetting />
                        </SettingsGroup>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Appearance
                    </h2>
                    <div className="mt-3 bg-white dark:bg-slate-800 shadow sm:rounded-lg overflow-hidden">
                        <SettingsGroup>
                            <ThemeSetting />
                        </SettingsGroup>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        to="/user-management"   
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
                    >
                        ← Back to User Management
                    </Link>
                </div>
            </div>
        </div>
    );
}