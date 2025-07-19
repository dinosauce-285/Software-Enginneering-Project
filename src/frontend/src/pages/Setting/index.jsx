import React from 'react';
import NavigationBar from '../../components/NavigationBar';
import Search from '../../components/Search';
import SettingRow from '../../components/SettingRow';
import EmailSetting from '../../components/EmailSetting';


export default function SettingLayout() {
    return (
        <div className="flex min-h-screen w-screen ">
            {/* Sidebar */}
            <div className="w-[9rem] flex-shrink-0">
                <NavigationBar />
            </div>


            {/* Main content */}
            <div className=" flex flex-col flex-1   ml-[9rem]">
                {/* Top search */}
                <Search />

                {/* Content */}
                <main className="flex-1 mt-4 pt-8 bd-red-600">
                    <div className="max-w-5xl bg-white rounded-md shadow p-6">
                        {/* Account section */}
                        <h2 className="text-xl font-semibold mb-4">Account</h2>
                        <div className="space-y-1 divide-y">
                            <EmailSetting />
                            {/* <SettingRow label="Email" value="nguyentanvan123@gmail.com" /> */}
                            <SettingRow label="Phone" value="0325609027" />
                            <SettingRow label="Username" value="vannguyen123" />
                            <SettingRow label="Change Password" value="••••••••" />
                            <SettingRow label="Delete Account" />
                        </div>

                        {/* Notifications */}
                        <h2 className="text-xl font-semibold mt-6 mb-4">Notifications</h2>
                        <div className="space-y-1 divide-y">
                            <SettingRow label="Receive Email Notifications" value="Enabled" />
                            <SettingRow label="Reminder Time" value="8:00 PM" />
                        </div>
                        {/* Appearance */}
                        <h2 className="text-xl font-semibold mt-6 mb-4">Appearance</h2>
                        <div className="space-y-1 divide-y">
                            <SettingRow label="Theme" value="Light" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
