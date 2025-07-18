import { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function DeleteDialog() {
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = () => {
    alert("Memory deleted!");
    setShowDialog(false);
  };

  return (
    <div>
      <button
        className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100"
        onClick={() => setShowDialog(true)}
      >
        Delete
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-5 w-[300px] h-[200px] relative flex flex-col justify-between">
            {/* Close icon */}
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              onClick={() => setShowDialog(false)}
            >
              <FiX />
            </button>

            {/* Nội dung */}
            <div>
              <h3 className="text-xl font-bold mb-2">Delete Memory</h3>
              <p className="text-base text-gray-800">
                Are you sure you want to delete this memory?
              </p>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1 rounded border border-black text-black text-base hover:bg-gray-100"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded bg-[#0050ff] text-white text-base shadow hover:bg-blue-700"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
