

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
import { logoutUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

import defaultAvatar from '../assets/defaultAvt.png';

export default function UserMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isViewingAvatar, setIsViewingAvatar] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const menuRef = useRef(null);
  const avatarMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    // Thêm logic gọi API upload nếu muốn
    console.log('Upload:', file);
    setIsChangingAvatar(false);
    setFile(null);
    setPreview(null);
    setError('');
  };

  if (!user) return null;

  return (
    <>
      <div className="flex items-center gap-1">
        <div className="relative" ref={avatarMenuRef}>
          <button onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)} title="Avatar Menu"   className="flex items-center justify-center">
            <img
              src={user.avatar || defaultAvatar}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover bg-gray-200 cursor-pointer transition-opacity hover:opacity-80"
            />
          </button>
          {isAvatarMenuOpen && (
            <div className="absolute right-0 md:left-1/2 md:-translate-x-1/2 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-md w-fit z-[9999] border border-gray-200 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => { setIsViewingAvatar(true); setIsAvatarMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 whitespace-nowrap"
              >
                View Avatar
              </button>
              <button
                onClick={() => { navigate('/change-avatar'); setIsAvatarMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 whitespace-nowrap"
              >
                Change Avatar
              </button>
            </div>
          )}
        </div>

        {/* User menu button */}
        <div className="relative" ref={menuRef}>
          <button
            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FiChevronDown
              className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 z-[9999] overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={user.avatar || defaultAvatar}
                      alt="User Avatar"
                      className="w-10 h-10 object-cover bg-gray-200"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 truncate dark:text-gray-100">{user.display_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <ul className="text-sm text-gray-700 py-1">
                <li
                  onClick={() => handleNavigate('/settings')}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:pl-5"
                >
                  <FiSettings className="text-gray-500 dark:text-gray-400" /> Settings
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:pl-5"
                >
                  <FiLogOut /> Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {isViewingAvatar && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setIsViewingAvatar(false)}
        >
      
          <div
            className="flex flex-col items-end"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={user.avatar || defaultAvatar}
              className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setIsViewingAvatar(false)}
              className="mt-2 px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
