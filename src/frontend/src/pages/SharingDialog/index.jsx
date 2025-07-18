import { useState } from "react";
import { FiX } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaXTwitter, FaEnvelope } from "react-icons/fa6";

export default function ShareDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const shareUrl = "https://example.com/memory";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Copied!");
    } catch (err) {
      alert("Failed to copy");
    }
  };

  return (
    <div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setShowDialog(true)}
      >
        Share
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-[400px] relative">
            {/* Close icon */}
            <button
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
              onClick={() => setShowDialog(false)}
            >
              <FiX />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-6">Share Memory</h2>

            {/* Icons */}
            <div className="flex justify-around mb-6 text-center">
              <div>
                <FaWhatsapp className="text-[40px] text-green-500 mx-auto" />
                <p className="text-sm mt-1">WhatsApp</p>
              </div>
              <div>
                <FaFacebookF className="text-[40px] text-blue-600 mx-auto" />
                <p className="text-sm mt-1">Facebook</p>
              </div>
              <div>
                <FaTwitter className="text-[40px] text-sky-400 mx-auto" />
                <p className="text-sm mt-1">Twitter</p>
              </div>
              <div>
                <FaXTwitter className="text-[40px] text-black mx-auto" />
                <p className="text-sm mt-1">X</p>
              </div>
              <div>
                <FaEnvelope className="text-[40px] text-black mx-auto" />
                <p className="text-sm mt-1">Email</p>
              </div>
            </div>

            {/* Share link + copy button */}
            <div className="flex items-center border rounded-full px-4 py-2 shadow text-base">
              <span className="flex-1 text-sm text-gray-800 truncate">{shareUrl}</span>
              <button
                className="ml-2 bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow hover:bg-blue-700"
                onClick={handleCopy}
              >
                copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
