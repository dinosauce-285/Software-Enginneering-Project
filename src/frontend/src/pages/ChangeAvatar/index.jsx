// src/pages/ChangeAvatar/index.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../contexts/AuthContext';
import { uploadAvatar } from '../../services/api';

export default function ChangeAvatarPage() {
  const { user, setUser } = useAuth(); // Lấy cả hàm setUser để cập nhật context
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const updatedUser = await uploadAvatar(file);
      setUser(updatedUser); // Cập nhật thông tin user trong context
      alert('Avatar updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to upload avatar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Change Your Avatar</h1>
        <div className="flex flex-col items-center gap-6">
          <img
            src={preview || "/src/assets/defaultAvt.png"}
            alt="Avatar Preview"
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Choose Image
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Uploading...' : 'Save and Upload'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}