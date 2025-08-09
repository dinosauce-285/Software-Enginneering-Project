import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import SettingsGroup from '../../components/SettingsGroup';
import SettingRow from '../../components/SettingRow';
import EmailSetting from '../../components/EmailSetting';
import UsernameSetting from '../../components/Username';
import ChangePasswordSetting from '../../components/ChangePasswordSetting';
import EmailNotificationSetting from '../../components/EmailNotificationSetting';
import ReminderTimeSetting from '../../components/ReminderTimeSetting';
import ThemeSetting from '../../components/ThemeSetting';

export default function SettingLayout() {
    const navigate = useNavigate();
    
    return (
        <AppLayout>
            <div className="w-full py-8">
                
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Account
                </h2>
                <div className="mt-3">
                    <SettingsGroup>
                        <EmailSetting />
                        <UsernameSetting />
                        <ChangePasswordSetting />
                        <SettingRow
                            label="Delete Account"
                            onClick={() => navigate('/delete-account')}
                        />
                    </SettingsGroup>
                </div>

                <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Notifications
                </h2>
                <div className="mt-3">
                    <SettingsGroup>
                        <EmailNotificationSetting />
                        <ReminderTimeSetting />
                    </SettingsGroup>
                </div>

                <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Appearance
                </h2>
                <div className="mt-3">
                    <SettingsGroup>
                        <ThemeSetting />
                    </SettingsGroup>
                </div>

            </div>
        </AppLayout>
    );
}