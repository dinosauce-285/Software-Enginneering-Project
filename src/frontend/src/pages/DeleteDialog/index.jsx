import { FiX } from 'react-icons/fi';

export default function DeleteDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-5 w-[300px] h-[200px] relative flex flex-col justify-between">
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          <FiX />
        </button>
        <div>
          <h3 className="text-xl font-bold mb-2">Delete Memory</h3>
          <p className="text-base text-gray-800">Are you sure you want to delete this memory?</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1 rounded border border-black text-black text-base hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 rounded bg-[#0050ff] text-white text-base shadow hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
