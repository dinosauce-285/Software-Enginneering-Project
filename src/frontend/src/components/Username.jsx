// import React, { useState } from 'react';
// import SettingRow from './SettingRow';

// export default function UsernameSetting() {
//     const [username, setUsername] = useState("vannguyen123");
//     const [showModal, setShowModal] = useState(false);
//     const [newUsername, setNewUsername] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const [lastChangedAt, setLastChangedAt] = useState(Date.now() - 20 * 24 * 60 * 60 * 1000);

//     const isValidUsername = (name) => /^[a-z0-9_]{3,30}$/.test(name);

//     const handleConfirm = async () => {
//         if (!newUsername.trim()) {
//             setError("Please enter a new username.");
//             return;
//         }
//         if (!isValidUsername(newUsername.trim())) {
//             setError("Username must be 3–30 characters, only a–z, 0–9, and underscore.");
//             return;
//         }
//         const now = Date.now();
//         if (now - lastChangedAt < 30 * 24 * 60 * 60 * 1000) {
//             setError("You can only change your username once every 30 days.");
//             return;
//         }

//         setLoading(true);
//         setError("");

//         try {

//             const res = await fetch('/api/replace-username', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ newUsername: newUsername.trim() }),
//             });
//             const data = await res.json();

//             if (res.ok) {
//                 setUsername(newUsername.trim());
//                 setLastChangedAt(now); 
//                 setShowModal(false);
//                 setNewUsername("");
//                 alert("Username changed successfully!");
//             } else {
//                 setError(data.message || "Username already exists or is not allowed.");
//             }
//         } catch (err) {
//             setError("Server error, please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//         setNewUsername("");
//         setError("");
//     };

//     // Tính số ngày còn lại
//     const now = Date.now();
//     const daysLeft = Math.ceil((30 * 24 * 60 * 60 * 1000 - (now - lastChangedAt)) / (24 * 60 * 60 * 1000));
//     const canChange = now - lastChangedAt >= 30 * 24 * 60 * 60 * 1000;

//     return (
//         <>
//             <SettingRow
//                 label="Username"
//                 value={username}
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
//                                 <p className="text-red-600 mb-2">
//                                     ⚠ You can only change your username once every 30 days. Please wait {daysLeft} more day{daysLeft > 1 ? "s" : ""}.
//                                 </p>
//                             )}
//                             <p className="mb-4">Enter a new username to replace the old one:</p>
//                             <input
//                                 type="text"
//                                 placeholder="Enter new username"
//                                 value={newUsername}
//                                 onChange={(e) => setNewUsername(e.target.value)}
//                                 className="w-full border rounded px-3 py-2 mb-2"
//                             />
//                             {error && <p className="text-red-500 mb-2">{error}</p>}
//                             <div className="flex gap-3 justify-end">
//                                 <button
//                                     onClick={handleConfirm}
//                                     disabled={loading || !canChange}
//                                     className={`px-4 py-2 rounded text-white ${loading || !canChange ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
//                                         }`}
//                                 >
//                                     {loading ? "Processing..." : "Confirm"}
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

// src/components/UsernameSetting.jsx
import React, { useState } from 'react';
import SettingRow from './SettingRow';

// Một hàm helper để lấy thông tin user từ localStorage một cách an toàn
const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : {};
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return {};
    }
};

export default function UsernameSetting() {
    // State "nguồn chân lý" là thông tin người dùng hiện tại
    const [currentUser, setCurrentUser] = useState(getCurrentUser());

    // State cho modal và form
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    // --- LOGIC 30 NGÀY DỰA TRÊN DỮ LIỆU THẬT TỪ BACKEND ---
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    // Lấy thời gian đổi lần cuối từ object currentUser
    const lastChangedAt = currentUser.usernameLastChangedAt ? new Date(currentUser.usernameLastChangedAt).getTime() : 0;
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
            // Gọi đến API đúng mà chúng ta đã tạo
            const response = await fetch(`${API_BASE_URL}/auth/change-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ newUsername: newUsername.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Hiển thị lỗi trả về từ backend
                throw new Error(data.message || "An unknown error occurred.");
            }

            // Cập nhật thành công!
            alert("Username changed successfully!");

            // Cập nhật lại toàn bộ user object từ data trả về của API vào localStorage và state
            localStorage.setItem('user', JSON.stringify(data));
            setCurrentUser(data);

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
                value={currentUser?.display_name || "Not available"}
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
