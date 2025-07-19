import React, { useState } from 'react';
import NavigationBar from '../../components/NavigationBar';
import Search from '../../components/Search';

export default function DeleteAccount() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);

    const handleDelete = () => {
        if (checked1 && checked2 && checked3) {
            setShowConfirm(true);
        } else {
            alert('Please confirm all conditions before deleting.');
        }
    };

    const handleConfirmDelete = () => {
        console.log('Password to confirm delete:', password);
        // TODO: call API to delete account
        setShowConfirm(false);
    };

    return (
        <div className="flex min-h-screen w-screen">
            {/* Navbar bên trái */}
            <NavigationBar />

            {/* Nội dung bên phải */}
            <div className="flex flex-col flex-1 min-h-screen items-center">
                {/* Bọc Search và Main chung một khung có max-w giống nhau */}
                <div className="w-[95%]">
                    {/* Thanh tìm kiếm */}
        
                        <Search />
                 

                    {/* Nội dung chính */}
                    <main className="mt-9 pt-8 rounded-b width-[100%]">
                        <div className="bg-white rounded shadow p-8">
                            <h1 className="text-xl font-semibold mb-4">Delete Account Permanently</h1>
                            <p className="mb-4 text-gray-700">
                                Let us know if you want to permanently delete your SoulNote account.
                                Once the deletion process begins, you won’t be able to reactivate your account
                                or retrieve any content or information you’ve added.
                            </p>
                            <a href="#" className="text-blue-600 hover:underline mb-4 inline-block">
                                Learn more about deleting your account.
                            </a>
                            <div className="flex flex-col gap-2 mb-6">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" checked={checked1} onChange={e => setChecked1(e.target.checked)} />
                                    <span>I understand that all my memories will be permanently deleted.</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" checked={checked2} onChange={e => setChecked2(e.target.checked)} />
                                    <span>I understand that this action cannot be undone.</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" checked={checked3} onChange={e => setChecked3(e.target.checked)} />
                                    <span>I want to permanently delete my SoulNote account.</span>
                                </label>
                            </div>
                            <p className="text-gray-600 mb-6">
                                We're sad to see you go. Your journey, your memories, and your feelings have meant a lot to us.
                            </p>
                            <div className="flex gap-4 justify-end">
                                <button onClick={handleDelete} className="bg-gray-50 text-gray-800 border border-gray-200 px-4 py-2 rounded hover:bg-gray-100">
                                    Delete
                                </button>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Modal confirm password */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Confirm Password</h2>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded mb-4"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
