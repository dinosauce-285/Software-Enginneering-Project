// src/components/Dialogs/SuccessDialog.jsx
import { FiCheckCircle, FiX } from 'react-icons/fi';

export default function SuccessDialog({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[320px] relative flex flex-col items-center text-center">
        
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>

        <div className="mb-4 text-green-500">
          <FiCheckCircle size={48} />
        </div>

        <h3 className="text-xl font-bold mb-2">{title || 'Success!'}</h3>
        <p className="text-base text-gray-700 mb-6">
          {message || 'Your action was completed successfully.'}
        </p>
        
        <div className="w-full">
          <button
            className="w-full px-4 py-2 rounded bg-[#0050ff] text-white text-base shadow hover:bg-blue-700"
            onClick={onClose}
          >
            OK
          </button>
        </div>
        
      </div>
    </div>
  );
}