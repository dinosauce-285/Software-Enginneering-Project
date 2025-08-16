
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AppLayout from '../../components/AppLayout';

// export default function DeleteAccount() {
//     const navigate = useNavigate();
//     const [showConfirm, setShowConfirm] = useState(false);
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

//     const [checked1, setChecked1] = useState(false);
//     const [checked2, setChecked2] = useState(false);
//     const [checked3, setChecked3] = useState(false);

//     const isDeleteEnabled = checked1 && checked2 && checked3;

//     const handleDelete = () => {
//         if (isDeleteEnabled) {
//             setShowConfirm(true);
//         }
//     };

//     const handleConfirmDelete = async () => {
//         setLoading(true);
//         setError('');

//         try {
//             const token = localStorage.getItem('accessToken');
//             const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
//                 method: 'DELETE', // <-- Dùng phương thức DELETE
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ password }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'An unknown error occurred.');
//             }

//             // Xóa thành công!
//             alert('Your account has been permanently deleted. You will now be logged out.');
//             // Dọn dẹp localStorage và chuyển hướng về trang chủ/đăng nhập
//             localStorage.removeItem('accessToken');
//             localStorage.removeItem('user');
//             navigate('/');

//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <AppLayout>
//                 <div className="bg-white rounded-lg shadow-md p-6 md:p-8 w-full max-w-2xl mx-auto">
//                     <h1 className="text-xl font-semibold mb-4 text-red-700">Delete Account Permanently</h1>
//                     <p className="mb-4 text-gray-700">
//                         This action is irreversible. Once you delete your account, you will not be able to reactivate it or retrieve any of your content or information.
//                     </p>

//                     <div className="flex flex-col gap-3 mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
//                         <label className="flex items-center cursor-pointer">
//                             <input type="checkbox" className="mr-3 h-4 w-4 accent-red-600" checked={checked1} onChange={e => setChecked1(e.target.checked)} />
//                             <span>I understand that all my memories will be permanently deleted.</span>
//                         </label>
//                         <label className="flex items-center cursor-pointer">
//                             <input type="checkbox" className="mr-3 h-4 w-4 accent-red-600" checked={checked2} onChange={e => setChecked2(e.target.checked)} />
//                             <span>I understand that this action cannot be undone.</span>
//                         </label>
//                         <label className="flex items-center cursor-pointer">
//                             <input type="checkbox" className="mr-3 h-4 w-4 accent-red-600" checked={checked3} onChange={e => setChecked3(e.target.checked)} />
//                             <span>I want to permanently delete my SoulNote account.</span>
//                         </label>
//                     </div>

//                     <div className="flex gap-4 justify-end border-t pt-4">
//                         <button onClick={() => navigate('/setting')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleDelete}
//                             disabled={!isDeleteEnabled}
//                             className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
//                         >
//                             Delete Account
//                         </button>
//                     </div>
//                 </div>
//             </AppLayout>

//             {showConfirm && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
//                         <h2 className="text-lg font-semibold mb-4">Are you absolutely sure?</h2>
//                         <p className="mb-4 text-sm text-gray-600">This is your last chance. To confirm, please enter your current password.</p>

//                         {error && <p className="text-red-500 mb-2 text-sm">⚠ {error}</p>}

//                         <input
//                             type="password"
//                             className="w-full px-3 py-2 border rounded mb-4"
//                             placeholder="Enter your password"
//                             value={password}
//                             onChange={e => setPassword(e.target.value)}
//                         />
//                         <div className="flex justify-end gap-2">
//                             <button onClick={() => { setShowConfirm(false); setError(''); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" disabled={loading}>
//                                 Cancel
//                             </button>
//                             <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400" disabled={loading}>
//                                 {loading ? 'Deleting...' : 'Confirm Deletion'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';

export default function DeleteAccount() {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);

    const isDeleteEnabled = checked1 && checked2 && checked3;

    const handleDelete = () => {
        if (isDeleteEnabled) {
            setShowConfirm(true);
        }
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An unknown error occurred.');
            }
            alert('Your account has been permanently deleted. You will now be logged out.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AppLayout>
                {/* THAY ĐỔI: Thêm style dark mode cho container chính */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 w-full max-w-2xl mx-auto border dark:border-gray-700">
                    {/* THAY ĐỔI: Màu chữ tiêu đề */}
                    <h1 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-500">Delete Account Permanently</h1>
                    {/* THAY ĐỔI: Màu chữ mô tả */}
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        This action is irreversible. Once you delete your account, you will not be able to reactivate it or retrieve any of your content or information.
                    </p>

                    {/* THAY ĐỔI: Nền và viền của khu vực xác nhận */}
                    <div className="flex flex-col gap-3 mb-6 bg-red-50 dark:bg-red-700/40 border border-red-200 dark:border-red-500 p-4 rounded-lg text-gray-800 dark:text-gray-200">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-3 h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-red-600 dark:text-red-500 focus:ring-red-500" checked={checked1} onChange={e => setChecked1(e.target.checked)} />
                            <span>I understand that all my memories will be permanently deleted.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-3 h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-red-600 dark:text-red-500 focus:ring-red-500" checked={checked2} onChange={e => setChecked2(e.target.checked)} />
                            <span>I understand that this action cannot be undone.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-3 h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-red-600 dark:text-red-500 focus:ring-red-500" checked={checked3} onChange={e => setChecked3(e.target.checked)} />
                            <span>I want to permanently delete my SoulNote account.</span>
                        </label>
                    </div>

                    {/* THAY ĐỔI: Style cho các nút footer */}
                    <div className="flex gap-4 justify-end border-t dark:border-gray-700 pt-4">
                        <button onClick={() => navigate('/setting')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 font-semibold">
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={!isDeleteEnabled}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-800 disabled:cursor-not-allowed font-semibold"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </AppLayout>

            {showConfirm && (
                // THAY ĐỔI: Backdrop của modal
                <div className="fixed inset-0 bg-black/60 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
                    {/* THAY ĐỔI: Nền của panel modal */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full border dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Are you absolutely sure?</h2>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">This is your last chance. To confirm, please enter your current password.</p>

                        {error && <p className="text-red-500 mb-2 text-sm">⚠ {error}</p>}

                        {/* THAY ĐỔI: Style cho input */}
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded mb-4 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            {/* THAY ĐỔI: Style cho các nút trong modal */}
                            <button onClick={() => { setShowConfirm(false); setError(''); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold" disabled={loading}>
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-800 disabled:cursor-not-allowed font-semibold" disabled={loading}>
                                {loading ? 'Deleting...' : 'Confirm Deletion'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}