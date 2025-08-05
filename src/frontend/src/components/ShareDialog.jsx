// src/components/Dialogs/ShareDialog.jsx
import React, { useState } from 'react';
import { FiCopy, FiCheck, FiX, FiLink } from 'react-icons/fi';

export default function ShareDialog({ isOpen, onClose, onConfirm, shareUrl, isLoading }) {
    const [copied, setCopied] = useState(false);
    const [shouldExpire, setShouldExpire] = useState(true); // Mặc định là có hết hạn

    const handleCopy = () => {
        // Chỉ thực hiện nếu chưa ở trạng thái "copied" để tránh click nhiều lần
        if (!copied && shareUrl) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setCopied(true);
                // Đặt timeout để ẩn thông báo "Copied!" sau 2 giây
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black"><FiX/></button>
                <h3 className="text-xl font-bold mb-4">Share this Memory</h3>
                
                {/* Nếu đang loading hoặc đã có link */}
                {isLoading || shareUrl ? (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Anyone with this link can view this memory.</p>
                        <div className="flex items-center border rounded-lg p-2 bg-gray-50">
                            <input type="text" readOnly value={isLoading ? "Generating link..." : shareUrl} className="flex-grow focus:outline-none bg-transparent"/>
                            {!isLoading && (
                                <button onClick={handleCopy} className="p-2 rounded hover:bg-gray-200">
                                    {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
                                </button>
                            )}
                        </div>
                        <button onClick={onClose} className="w-full mt-4 px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700">Done</button>
                    </div>
                ) : (
                    // Giao diện để chọn options
                    <div>
                        <div className="flex items-center gap-3 mb-6 bg-gray-100 p-3 rounded-md">
                            <input
                                type="checkbox"
                                id="expire-link"
                                checked={shouldExpire}
                                onChange={(e) => setShouldExpire(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="expire-link" className="flex flex-col">
                                <span className="font-medium text-gray-800">Set link to expire</span>
                                <span className="text-xs text-gray-500">The link will be invalid after 7 days.</span>
                            </label>
                        </div>
                        <button onClick={() => onConfirm({ expires: shouldExpire })} className="w-full px-4 py-2 rounded bg-blue-600 text-white flex items-center justify-center gap-2 hover:bg-blue-700">
                            <FiLink />
                            Create Share Link
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}