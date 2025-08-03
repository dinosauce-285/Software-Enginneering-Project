// // // src/components/EmailSetting.jsx
// // import React, { useState } from 'react';
// // import SettingRow from './SettingRow';

// // export default function EmailSetting() {
// //     const [emails, setEmails] = useState(["nguyentanvan123@gmail.com"]);
// //     const [showModal, setShowModal] = useState(false);
// //     const [error, setError] = useState("");

// //     const handleDeleteEmail = () => {
// //         if (emails.length <= 1) {
// //             setError("You must have at least one email.");
// //         } else {
// //             setEmails(emails.slice(0, -1));
// //             setShowModal(false);
// //             setError("");
// //         }
// //     };

// //     return (
// //         <>
// //             <SettingRow
// //                 label="Email"
// //                 value={emails[0]}
// //                 onClick={() => setShowModal(true)}
// //             />

// //             {/* Modal */}
// //             {showModal && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
// //                     <div className="bg-white p-6 rounded-md shadow max-w-md w-full">
// //                         <h3 className="text-lg font-semibold mb-4">Manage Email</h3>
// //                         {error && <p className="text-red-500 mb-2">{error}</p>}
// //                         <div className="flex gap-4 justify-end">
// //                             <button
// //                                 onClick={handleDeleteEmail}
// //                                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
// //                             >
// //                                 Delete
// //                             </button>
// //                             <button
// //                                 onClick={() => alert('Add email logic (coming soon)')}
// //                                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
// //                             >
// //                                 Add
// //                             </button>
// //                             <button
// //                                 onClick={() => { setShowModal(false); setError(""); }}
// //                                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
// //                             >
// //                                 Cancel
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </>
// //     );
// // }

// // src/components/EmailSetting.jsx
// import React, { useState } from 'react';
// import SettingRow from './SettingRow';

// export default function EmailSetting() {
//     const [emails, setEmails] = useState(["nguyentanvan123@gmail.com"]);
//     const [showModal, setShowModal] = useState(false);
//     const [newEmail, setNewEmail] = useState(""); // new state to hold the new email
//     const [error, setError] = useState("");

//     const handleChangeEmail = () => {
//         if (!newEmail) {
//             setError("Please enter a new email.");
//         } else {
//             setEmails([newEmail, ...emails.slice(1)]);
//             setShowModal(false);
//             setNewEmail("");
//             setError("");
//         }
//     };

//     return (
//         <>
//             <SettingRow
//                 label="Email"
//                 value={emails[0]}
//                 onClick={() => setShowModal(true)}
//             />

//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//                     <div className="bg-white p-6 rounded-md shadow max-w-md w-full">
//                         <h3 className="text-lg font-semibold mb-4">Change Email</h3>
//                         {error && <p className="text-red-500 mb-2">{error}</p>}
//                         <input
//                             type="email"
//                             placeholder="Enter new email"
//                             value={newEmail}
//                             onChange={(e) => setNewEmail(e.target.value)}
//                             className="border border-gray-300 p-2 rounded w-full mb-4"
//                         />
//                         <div className="flex gap-4 justify-end">
//                             <button
//                                 onClick={handleChangeEmail}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                             >
//                                 Change
//                             </button>
//                             <button
//                                 onClick={() => { setShowModal(false); setError(""); setNewEmail(""); }}
//                                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// src/components/EmailSetting.jsx
import React, { useState, useEffect } from 'react';
import SettingRow from './SettingRow';

// Một hàm helper để lấy thông tin user từ localStorage
const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return null;
    }
};

export default function EmailSetting() {
    // State để lưu thông tin người dùng hiện tại
    const [currentUser, setCurrentUser] = useState(getCurrentUser());

    // State cho giao diện
    const [showModal, setShowModal] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState(""); // Cần mật khẩu để xác nhận
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const handleCloseModal = () => {
        setShowModal(false);
        setNewEmail("");
        setPassword("");
        setError("");
    };

    const handleChangeEmail = async () => {
        if (!newEmail || !password) {
            setError("Please provide the new email and your current password.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }

            const response = await fetch(`${API_BASE_URL}/auth/change-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    newEmail: newEmail,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An unknown error occurred.');
            }

            // Thành công!
            alert(data.message);

            // Cập nhật thông tin user trên giao diện và trong localStorage
            const updatedUser = { ...currentUser, email: newEmail };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            handleCloseModal();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SettingRow
                label="Email"
                value={currentUser?.email || "No email found"}
                onClick={() => setShowModal(true)}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md shadow max-w-md w-full">
                        <div className="w-full bg-orange-100 py-3 rounded-t-md flex justify-center">
                            <span className="text-orange-700 text-lg font-semibold">Change Login Email</span>
                        </div>
                        <div className="p-6">
                            <p className="mb-4 text-sm text-gray-600">
                                Enter your new email and current password. A confirmation will be sent to the new address.
                            </p>

                            <input
                                type="email"
                                placeholder="New email address"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-3"
                            />
                            <input
                                type="password"
                                placeholder="Current password to confirm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-2"
                            />

                            {error && <p className="text-red-500 my-2">⚠ {error}</p>}

                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={handleChangeEmail}
                                    disabled={loading}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
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