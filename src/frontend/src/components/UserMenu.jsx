// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { FiSettings, FiLogOut, FiChevronDown, FiEdit3 } from "react-icons/fi";
// import { logoutUser } from '../services/api';

// // 1. IMPORT `useAuth` TỪ CONTEXT
// import { useAuth } from '../contexts/AuthContext';

// export default function UserMenu() {
//   // 2. GỌI HOOK ĐỂ LẤY THÔNG TIN USER
//   const { user } = useAuth();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const menuRef = useRef(null);

//   const avatarMenuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsMenuOpen(false);
//       }
//       if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
//         setIsAvatarMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     logoutUser();
//     navigate('/login');
//     // Cân nhắc reload trang để đảm bảo mọi state được reset
//     // window.location.reload(); 
//   };

//   const handleNavigate = (path) => {
//     navigate(path);
//     setIsMenuOpen(false);
//   }

//   // Nếu chưa có thông tin user (đang tải hoặc chưa đăng nhập), có thể không render gì cả
//   if (!user) {
//     return null; // Hoặc một skeleton loader
//   }

//   return (
//     <div className="flex items-center gap-1"> {/* Giảm khoảng cách giữa 2 nút */}

//       {/* === NÚT AVATAR RIÊNG VỚI HIỆU ỨNG HOVER === */}
//       <Link to="/change-avatar" title="Change Avatar">
//         <img
//           src={user.avatar || "/src/assets/defaultAvt.png"}
//           alt="User Avatar"
//           className="w-9 h-9 rounded-full object-cover bg-gray-200 cursor-pointer transition-opacity hover:opacity-80"
//         />
//       </Link>

//       {/* === NÚT DROPDOWN RIÊNG VỚI HIỆU ỨNG HOVER === */}
//       <div className="relative" ref={menuRef}>
//         <button
//           className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100" // Thêm padding và hover
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <FiChevronDown
//             className={`text-gray-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
//           />
//         </button>
//         {isMenuOpen && (
//           <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border z-50 overflow-hidden">
//             {/* ... Nội dung menu chính giữ nguyên ... */}
//             <div className="px-4 py-3 border-b border-gray-200">
//               <div className="flex items-center gap-3">
//                 <Link to="/change-avatar" title="Change Avatar">
//                     <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
//                         <img
//                         src={user.avatar || "/src/assets/defaultAvt.png"}
//                         alt="User Avatar"
//                         className="w-10 h-10 rounded-full object-cover bg-gray-200 cursor-pointer transition-opacity hover:opacity-80"
//                         />
//                     </div>
//                 </Link>
//                 <div>
//                   <p className="font-semibold text-sm text-gray-800 truncate" title={user.display_name}>
//                     {user.display_name}
//                   </p>
//                   <p className="text-xs text-gray-500 truncate" title={user.email}>
//                     {user.email}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <ul className="text-sm text-gray-700 py-1">
//               <li
//                 onClick={() => handleNavigate('/settings')}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:pl-5"
//               >
//                 <FiSettings className="text-gray-500" /> Settings
//               </li>
//               <li
//                 onClick={handleLogout}
//                 className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:pl-5"
//               >
//                 <FiLogOut /> Log Out
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
import { logoutUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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

        {/* Avatar button */}
        <div className="relative" ref={avatarMenuRef}>
          <button onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)} title="Avatar Menu">
            <img
              src={user.avatar || "/src/assets/defaultAvt.png"}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover bg-gray-200 cursor-pointer transition-opacity hover:opacity-80"
            />
          </button>
          {/* {isAvatarMenuOpen && (
            <div className="absolute mt-2 left-1/2 -translate-x-1/2 bg-white shadow rounded min-w-max w-auto z-50">
              <button
                onClick={() => { setIsViewingAvatar(true); setIsAvatarMenuOpen(false); }}
                className="w-full text-left px-1 py-2 hover:bg-gray-100"  
              >
                View Avatar
              </button>
              <button
                onClick={() => { navigate('/change-avatar'); setIsAvatarMenuOpen(false); }}
                className="w-full text-left px-1 py-2 hover:bg-gray-100"
              >
                Change Avatar
              </button>
            </div>
          )} */}
          {isAvatarMenuOpen && (
            <div className="absolute mt-2 left-1/2 -translate-x-1/2 bg-white shadow rounded-md w-fit z-50">
              <button
                onClick={() => { setIsViewingAvatar(true); setIsAvatarMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
              >
                View Avatar
              </button>
              <button
                onClick={() => { navigate('/change-avatar'); setIsAvatarMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
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
              className={`text-gray-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={user.avatar || "/src/assets/defaultAvt.png"}
                      alt="User Avatar"
                      className="w-10 h-10 object-cover bg-gray-200"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 truncate">{user.display_name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <ul className="text-sm text-gray-700 py-1">
                <li
                  onClick={() => handleNavigate('/settings')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:pl-5"
                >
                  <FiSettings className="text-gray-500" /> Settings
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:pl-5"
                >
                  <FiLogOut /> Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* View Avatar Modal */}
      {/* {isViewingAvatar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4">
            <img src={user.avatar || "/src/assets/defaultAvt.png"} className="max-w-full max-h-[80vh]" />
            <button onClick={() => setIsViewingAvatar(false)} className="mt-2 px-4 py-1 bg-gray-200 rounded">Close</button>
          </div>
        </div>
      )} */}
      {isViewingAvatar && (
        // Lớp phủ màu đen toàn màn hình
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setIsViewingAvatar(false)}
        >
          {/*
      Container này dùng Flexbox theo chiều dọc (flex-col).
      'items-end' sẽ căn chỉnh các item con (ảnh và nút) về phía cuối (bên phải).
      Vì ảnh là phần tử rộng nhất, nó sẽ quyết định chiều rộng của container,
      và nút sẽ tự động được căn thẳng hàng với cạnh phải của ảnh.
    */}
          <div
            className="flex flex-col items-end"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ảnh vẫn giữ nguyên các lớp để giới hạn kích thước và có hiệu ứng */}
            <img
              src={user.avatar || "/src/assets/defaultAvt.png"}
              className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
            />

            {/* Nút "Close" nằm bên dưới ảnh nhờ flex-col */}
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
