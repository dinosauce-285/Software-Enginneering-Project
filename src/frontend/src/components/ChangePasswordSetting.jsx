import React, { useState } from 'react';
import SettingRow from './SettingRow';

export default function ChangePasswordSetting() {
    const [showModal, setShowModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [failCount, setFailCount] = useState(0);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const handleCloseModal = () => {
        setShowModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setFailCount(0);
    };

    const handleChangePassword = async () => {
        // Validate form
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            // 2. Lấy token từ localStorage
            const token = localStorage.getItem('accessToken');
            if (!token) {
                // Xử lý trường hợp không có token (ví dụ: chuyển hướng về trang đăng nhập)
                throw new Error("Authentication token not found. Please log in again.");
            }

            // 3. Gọi API bằng fetch hoặc axios
            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // <-- Gửi token trong header
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            // 4. Xử lý kết quả trả về
            if (!response.ok) {
                // Nếu response không thành công (status 4xx, 5xx), ném lỗi với message từ backend
                throw new Error(data.message || 'An unknown error occurred.');
            }

            // Nếu thành công
            alert(data.message); // Hoặc hiển thị một toast/notification đẹp hơn
            handleCloseModal();

        } catch (err) {
            // 5. Bắt lỗi (lỗi mạng hoặc lỗi từ backend) và hiển thị cho người dùng
            setError(err.message);
        } finally {
            // 6. Luôn dừng trạng thái loading
            setLoading(false);
        }
        // try {

        //     if (oldPassword === "123456789") {
        //         alert("Password changed successfully!");
        //         handleCloseModal();
        //     } else {
        //         setFailCount(prev => prev + 1);
        //         if (failCount + 1 >= 5) {
        //             setError("You have entered the wrong password too many times. Please wait until tomorrow to change your password.");
        //         } else {
        //             setError("Incorrect old password, please try again.");
        //         }
        //     }
        // } catch (err) {
        //     setError("Server error, please try again.");
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <>
            <SettingRow
                label="Change Password"
                value="*********"
                onClick={() => setShowModal(true)}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md shadow max-w-md w-full">
                        <div className="w-full bg-orange-100 py-3 rounded-t-md flex justify-center">
                            <span className="text-orange-700 text-lg font-semibold">Change Password</span>
                        </div>
                        <div className="p-6">
                            <p className="mb-4">To change your password, please fill in the form below:</p>

                            <input
                                type="password"
                                placeholder="Old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-2"
                            />
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-2"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-2"
                            />

                            {error && <p className="text-red-500 mb-2">⚠ {error}</p>}

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading || failCount >= 5}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {loading ? "Processing..." : "Change"}
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
