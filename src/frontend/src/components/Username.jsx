// import React, { useState } from 'react';
// import SettingRow from './SettingRow';
// import { useAuth } from '../../contexts/AuthContext';
// // Một hàm helper để lấy thông tin user từ localStorage một cách an toàn
// const getCurrentUser = () => {
//     try {
//         const user = localStorage.getItem('user');
//         return user ? JSON.parse(user) : {};
//     } catch (error) {
//         console.error("Failed to parse user from localStorage", error);
//         return {};
//     }
// };

// export default function UsernameSetting() {
//     // State "nguồn chân lý" là thông tin người dùng hiện tại
//     const [currentUser, setCurrentUser] = useState(getCurrentUser());

//     // State cho modal và form
//     const [showModal, setShowModal] = useState(false);
//     const [newUsername, setNewUsername] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     // --- LOGIC 30 NGÀY DỰA TRÊN DỮ LIỆU THẬT TỪ BACKEND ---
//     const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
//     // Lấy thời gian đổi lần cuối từ object currentUser
//     const lastChangedAt = currentUser.usernameLastChangedAt ? new Date(currentUser.usernameLastChangedAt).getTime() : 0;
//     const canChange = !lastChangedAt || (Date.now() - lastChangedAt > thirtyDaysInMs);
//     let daysLeft = 0;
//     if (!canChange && lastChangedAt) {
//         daysLeft = Math.ceil((thirtyDaysInMs - (Date.now() - lastChangedAt)) / (1000 * 60 * 60 * 24));
//     }
//     // --- KẾT THÚC LOGIC 30 NGÀY ---

//     const handleConfirm = async () => {
//         // Kiểm tra định dạng ở client để có phản hồi nhanh
//         if (!/^[a-z0-9_]{3,30}$/.test(newUsername)) {
//             setError("Username must be 3-30 chars, using only a-z, 0-9, and underscore (_).");
//             return;
//         }

//         setLoading(true);
//         setError("");

//         try {
//             const token = localStorage.getItem('accessToken');
//             // Gọi đến API đúng mà chúng ta đã tạo
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-username`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ newUsername: newUsername.trim() }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 // Hiển thị lỗi trả về từ backend
//                 throw new Error(data.message || "An unknown error occurred.");
//             }

//             // Cập nhật thành công!
//             alert("Username changed successfully!");

//             // Cập nhật lại toàn bộ user object từ data trả về của API vào localStorage và state
//             localStorage.setItem('user', JSON.stringify(data));
//             setCurrentUser(data);

//             // Đóng modal và reset form
//             setShowModal(false);
//             setNewUsername("");

//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//         setNewUsername("");
//         setError("");
//     };

//     return (
//         <>
//             <SettingRow
//                 label="Username"
//                 value={currentUser?.display_name || "Not available"}
//                 onClick={() => setShowModal(true)}
//             />

//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//                     <div className="bg-white rounded-md shadow max-w-md w-full">
//                         <div className="w-full bg-orange-100 py-3 rounded-t-md flex justify-center">
//                             <span className="text-orange-700 text-lg font-semibold">Change Username</span>
//                         </div>
//                         <div className="p-6">
//                             {!canChange && (
//                                 <p className="text-sm text-center font-semibold text-red-600 bg-red-100 p-2 rounded-md mb-4">
//                                     You can change your username again in {daysLeft} day{daysLeft > 1 ? "s" : ""}.
//                                 </p>
//                             )}
//                             <p className="mb-4 text-sm text-gray-600">Your username must be 3-30 characters long and can only contain lowercase letters (a-z), numbers (0-9), and underscores (_).</p>
//                             <input
//                                 type="text"
//                                 placeholder="Enter new username"
//                                 value={newUsername}
//                                 onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
//                                 className="w-full border rounded px-3 py-2 mb-2"
//                             />
//                             {error && <p className="text-red-500 mb-2">⚠ {error}</p>}
//                             <div className="flex gap-3 justify-end mt-4">
//                                 <button
//                                     onClick={handleConfirm}
//                                     disabled={loading || !canChange}
//                                     className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                                 >
//                                     {loading ? "Saving..." : "Confirm"}
//                                 </button>
//                                 <button
//                                     onClick={handleCloseModal}
//                                     className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// src/components/settings/UsernameSetting.jsx

import React, { useState } from 'react';
import SettingRow from './SettingRow';
import { useAuth } from '../contexts/AuthContext'; // 1. Import hook useAuth từ context

export default function UsernameSetting() {
    // 2. Lấy user và hàm updateUser từ context. Đây là nguồn chân lý duy nhất!
    const { user, updateUser } = useAuth();

    // Các state dành riêng cho UI của modal này vẫn được giữ lại
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // --- LOGIC 30 NGÀY - BÂY GIỜ DÙNG `user` TỪ CONTEXT ---
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    // Sử dụng optional chaining `?.` để an toàn nếu user chưa được tải
    const lastChangedAt = user?.usernameLastChangedAt ? new Date(user.usernameLastChangedAt).getTime() : 0;
    const canChange = !lastChangedAt || (Date.now() - lastChangedAt > thirtyDaysInMs);
    let daysLeft = 0;
    if (!canChange && lastChangedAt) {
        daysLeft = Math.ceil((thirtyDaysInMs - (Date.now() - lastChangedAt)) / (1000 * 60 * 60 * 24));
    }
    // --- KẾT THÚC LOGIC 30 NGÀY ---

    const handleConfirm = async () => {
        // Kiểm tra định dạng ở client để có phản hồi nhanh
        if (!/^[a-z0-9_]{3,30}$/.test(newUsername)) {
            setError("Username must be 3-30 chars, using only a-z, 0-9, and underscore (_).");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ newUsername: newUsername.trim() }),
            });

            const data = await response.json(); // data là object user mới từ backend

            if (!response.ok) {
                // Hiển thị lỗi trả về từ backend
                throw new Error(data.message || "An unknown error occurred.");
            }

            // Cập nhật thành công!
            alert("Username changed successfully!");

            // 3. === THAY ĐỔI QUAN TRỌNG NHẤT ===
            // Gọi hàm `updateUser` từ context để cập nhật trạng thái cho toàn bộ ứng dụng
            updateUser(data);

            // Đóng modal và reset form
            setShowModal(false);
            setNewUsername("");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewUsername("");
        setError("");
    };

    return (
        <>
            <SettingRow
                label="Username"
                // 4. Luôn hiển thị dữ liệu từ `user` của context
                value={user?.display_name || "Not available"}
                onClick={() => setShowModal(true)}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md shadow max-w-md w-full">
                        <div className="w-full bg-orange-100 py-3 rounded-t-md flex justify-center">
                            <span className="text-orange-700 text-lg font-semibold">Change Username</span>
                        </div>
                        <div className="p-6">
                            {!canChange && (
                                <p className="text-sm text-center font-semibold text-red-600 bg-red-100 p-2 rounded-md mb-4">
                                    You can change your username again in {daysLeft} day{daysLeft > 1 ? "s" : ""}.
                                </p>
                            )}
                            <p className="mb-4 text-sm text-gray-600">Your username must be 3-30 characters long and can only contain lowercase letters (a-z), numbers (0-9), and underscores (_).</p>
                            <input
                                type="text"
                                placeholder="Enter new username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                                className="w-full border rounded px-3 py-2 mb-2"
                            />
                            {error && <p className="text-red-500 mb-2">⚠ {error}</p>}
                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading || !canChange}
                                    className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : "Confirm"}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
