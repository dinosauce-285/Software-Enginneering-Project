import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import SettingRow from '../../components/SettingRow';
import EmailSetting from '../../components/EmailSetting';
import UsernameSetting from '../../components/Username';
import ChangePasswordSetting from '../../components/ChangePasswordSetting';
import DeleteAccount from '../DeleteAccount/index.jsx';
import EmailNotificationSetting from '../../components/EmailNotificationSetting';
import ReminderTimeSetting from '../../components/ReminderTimeSetting';
import ThemeSetting from '../../components/ThemeSetting';

export default function SettingLayout() {
    const navigate = useNavigate();
    return (
        <AppLayout>
            <div className="w-full bg-white rounded-md shadow p-6">
                {/* Account section */}
                <h2 className="text-xl font-semibold mb-4">Account</h2>
                <div className="space-y-1 divide-y">
                    <EmailSetting />
                    <UsernameSetting />
                    <ChangePasswordSetting />
                    <SettingRow
                        label="Delete Account"
                        onClick={() => navigate('/delete-account')}
                    />
                </div>

                {/* Notifications */}
                <h2 className="text-xl font-semibold mt-6 mb-4">Notifications</h2>
                <div className="space-y-1 divide-y">
                    <EmailNotificationSetting />
                    <ReminderTimeSetting />
                </div>

                {/* Appearance */}
                <h2 className="text-xl font-semibold mt-6 mb-4">Appearance</h2>
                <div className="space-y-1 divide-y">
                    <ThemeSetting />
                </div>
            </div>
        </AppLayout>
    );
}
