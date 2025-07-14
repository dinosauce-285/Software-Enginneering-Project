import { useState } from 'react';

export default function DeleteDialog() {
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = () => {
    // TODO: Xử lý xóa ở đây
    alert("Memory deleted!");
    setShowDialog(false);
  };

  return (
    <div>
      {/* Nút Delete */}
      <button
        className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100"
        onClick={() => setShowDialog(true)}
      >
        🗑 Delete
      </button>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
              onClick={() => setShowDialog(false)}
            >
              ×
            </button>

            {/* Nội dung Dialog */}
            <h3 className="text-lg font-bold mb-2">Delete Memory</h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this memory?
            </p>

            {/* Nút hành động */}
            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
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
