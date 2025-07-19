import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';



export default function DeleteAccount() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);

    const isDeleteEnabled = checked1 && checked2 && checked3;

    const handleDelete = () => {
        if (isDeleteEnabled) {
            setShowConfirm(true);
        }
    };

    const handleConfirmDelete = () => {
        console.log('Password to confirm delete:', password);
        setShowConfirm(false);
    };

    return (
        // 2. Dùng React Fragment <> để chứa cả Layout và Modal
        <>

            <AppLayout>
    
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 w-full">
                    <h1 className="text-xl font-semibold mb-4">Delete Account Permanently</h1>
                    <p className="mb-4 text-gray-700">
                        Let us know if you want to permanently delete your SoulNote account.
                        Once the deletion process begins, you won’t be able to reactivate your account
                        or retrieve any content or information you’ve added.
                    </p>
                    <a href="#" className="text-blue-600 hover:underline mb-4 inline-block">
                        Learn more about deleting your account.
                    </a>
                    <div className="flex flex-col gap-3 mb-6">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-3 h-4 w-4" checked={checked1} onChange={e => setChecked1(e.target.checked)} />
                            <span>I understand that all my memories will be permanently deleted.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-3 h-4 w-4" checked={checked2} onChange={e => setChecked2(e.target.checked)} />
                            <span>I understand that this action cannot be undone.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-3 h-4 w-4" checked={checked3} onChange={e => setChecked3(e.target.checked)} />
                            <span>I want to permanently delete my SoulNote account.</span>
                        </label>
                    </div>
                    <p className="text-gray-600 mb-6">
                        We're sad to see you go. Your journey, your memories, and your feelings have meant a lot to us.
                    </p>
                    <div className="flex gap-4 justify-end border-t pt-4">
                        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={!isDeleteEnabled} // <-- Nút bị vô hiệu hóa
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </AppLayout>

            {/* Modal confirm password được giữ nguyên bên ngoài AppLayout */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Confirm Your Action</h2>
                        <p className="mb-4 text-sm text-gray-600">To confirm, please enter your password.</p>
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
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                Confirm Deletion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}