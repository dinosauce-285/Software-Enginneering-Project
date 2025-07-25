import React, { useState } from 'react';
import SettingRow from './SettingRow';
import { FaEnvelope, FaPhone } from 'react-icons/fa'; // thêm ở đầu file


export default function PhoneSetting() {
    const [phone, setPhone] = useState("0325609027");
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState("inputPhone"); // "inputPhone" | "chooseMethod" | "inputOtp"
    const [newPhone, setNewPhone] = useState("");
    const [error, setError] = useState("");
    const [selectedMethod, setSelectedMethod] = useState(""); // "email" | "oldPhone"
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [failCount, setFailCount] = useState(0);

    const handleNextStep = () => {
        if (!newPhone.trim()) {
            setError("Please enter a new phone number.");
            return;
        }
        setError("");
        setStep("chooseMethod");
    };

    const handleSendOtp = async () => {
        if (!selectedMethod) {
            setError("Please select a method.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            // Gọi API gửi OTP (demo)
            await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ method: selectedMethod }),
            });
            setStep("inputOtp");
        } catch (err) {
            setError("Failed to send OTP, please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOtp = async () => {
        if (!otp.trim()) {
            setError("Please enter the OTP code.");
            return;
        }
        if (failCount >= 3) {
            setError("You have entered the wrong code too many times. Please wait until 48-hours before trying again.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            // Gọi API xác thực OTP và thay đổi phone
            const res = await fetch("/api/replace-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPhone, otp }),
            });
            const data = await res.json();
            if (res.ok) {
                setPhone(newPhone.trim());
                setShowModal(false);
                setStep("inputPhone");
                setNewPhone("");
                setOtp("");
                setFailCount(0);
                alert("Phone number changed successfully!");
            } else {
                setFailCount(prev => prev + 1);
                if (failCount + 1 >= 4) {
                    setError("You have entered the wrong code too many times. Please wait until 48-hours to trying again.");
                } else {
                    setError(data.message || "Incorrect code, please try again.");
                }
            }
        } catch (err) {
            setError("Server error, please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setStep("inputPhone");
        setNewPhone("");
        setOtp("");
        setError("");
        setSelectedMethod("");
        setFailCount(0);
    };

    return (
        <>
            <SettingRow
                label="Phone"
                value={phone}
                onClick={() => setShowModal(true)}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md shadow max-w-md w-full">
                        <div className="w-full bg-orange-100 py-3 rounded-t-md flex justify-center">
                            <span className="text-orange-700 text-lg font-semibold">Replace Phone</span>
                        </div>
                        <div className="p-6">
                            {step === "inputPhone" && (
                                <>
                                    <p className="mb-4">Enter a new phone number to replace the old one:</p>
                                    <input
                                        type="tel"
                                        placeholder="Enter new phone number"
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className="w-full border rounded px-3 py-2 mb-2"
                                    />
                                    {error && <p className="text-red-500 mb-2">{error}</p>}
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={handleNextStep} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                            Next
                                        </button>
                                        <button onClick={handleCloseModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}

                            {step === "chooseMethod" && (
                                <>
                                    <p className="mb-4">Choose where to send the OTP code:</p>
                                    <div className="space-y-2 mb-2">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="method" value="email"
                                                checked={selectedMethod === "email"}
                                                onChange={() => setSelectedMethod("email")} />
                                            <FaEnvelope className="text-gray-600" />
                                            Send to email (nguy****@gmail.com)
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="method" value="oldPhone"
                                                checked={selectedMethod === "oldPhone"}
                                                onChange={() => setSelectedMethod("oldPhone")} />
                                            <FaPhone className="text-gray-600" />
                                            Send to old phone (032****027)

                                        </label>
                                    </div>
                                    {error && <p className="text-red-500 mb-2">{error}</p>}
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={handleSendOtp} disabled={loading}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                            {loading ? "Sending..." : "Send"}
                                        </button>
                                        <button onClick={handleCloseModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}

                            {step === "inputOtp" && (
                                <>
                                    <p className="mb-4">Enter the 6-digit code we sent you:</p>
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full border rounded px-3 py-2 mb-2"
                                    />
                                    {error && <p className="text-red-500 mb-2">{error}</p>}
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={handleConfirmOtp} disabled={loading || failCount >= 5}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                            {loading ? "Verifying..." : "Confirm"}
                                        </button>
                                        <button onClick={handleCloseModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
