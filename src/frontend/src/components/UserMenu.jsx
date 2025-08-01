// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
// import { logoutUser } from '../services/api';

// export default function UserMenu() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [menuRef]);

//   const handleLogout = () => {
//     logoutUser();
//     navigate('/login');
//   };

//   const handleNavigate = (path) => {
//     navigate(path);
//     setIsMenuOpen(false);
//   }

//   return (
//     <div className="relative" ref={menuRef}>
//       <button
//         className="flex items-center gap-2 cursor-pointer p-1 rounded-full transition-colors duration-200 hover:bg-gray-100"
//         onClick={() => setIsMenuOpen(!isMenuOpen)}
//       >
//         <img
//           src="/src/assets/avt.avif"
//           alt="User Avatar"
//           className="w-9 h-9 rounded-full object-cover"
//         />
//         <FiChevronDown
//           className={`text-sm text-gray-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
//         />
//       </button>

//       <div
//         className={`
//           absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border z-50 overflow-hidden
//           transition-all duration-300 ease-in-out
//           ${isMenuOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}
//         `}
//       >
//         <div className="px-4 py-3 border-b border-gray-200">
//             <div className="flex items-center gap-3">
//                 <img
//                     src="/src/assets/avt.avif"
//                     alt="User Avatar"
//                     className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div>
//                     <p className="font-semibold text-sm text-gray-800">John Doe</p>
//                     <p className="text-xs text-gray-500">john.doe@example.com</p>
//                 </div>
//             </div>
//         </div>

//         <ul className="text-sm text-gray-700 py-1">
//           <li
//             onClick={() => handleNavigate('/settings')}
//             className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:pl-5"
//           >
//             <FiSettings className="text-gray-500" /> Settings
//           </li>
//           <li
//             onClick={handleLogout}
//             className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:pl-5"
//           >
//             <FiLogOut /> Log Out
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSettings, FiLogOut, FiChevronDown, FiEdit3 } from "react-icons/fi";
import { logoutUser } from '../services/api';

// 1. IMPORT `useAuth` TỪ CONTEXT
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu() {
  // 2. GỌI HOOK ĐỂ LẤY THÔNG TIN USER
  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const avatarMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    // Cân nhắc reload trang để đảm bảo mọi state được reset
    // window.location.reload(); 
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  }

  // Nếu chưa có thông tin user (đang tải hoặc chưa đăng nhập), có thể không render gì cả
  if (!user) {
    return null; // Hoặc một skeleton loader
  }

  return (
    <div className="flex items-center gap-1"> {/* Giảm khoảng cách giữa 2 nút */}
      
      {/* === NÚT AVATAR RIÊNG VỚI HIỆU ỨNG HOVER === */}
      <div className="relative" ref={avatarMenuRef}>
        <button 
          onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
          className="p-1 rounded-full transition-colors duration-200 hover:bg-gray-100" // Thêm padding và hover
        >
          <img
            src={user.avatar || "/src/assets/defaultAvt.png"}
            alt="User Avatar"
            className="w-9 h-9 rounded-full object-cover bg-gray-200"
          />
        </button>
        {isAvatarMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
            <Link to="/change-avatar" className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">
              <FiEdit3 />
              <span>Change Avatar</span>
            </Link>
          </div>
        )}
      </div>

      {/* === NÚT DROPDOWN RIÊNG VỚI HIỆU ỨNG HOVER === */}
      <div className="relative" ref={menuRef}>
        <button
          className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100" // Thêm padding và hover
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FiChevronDown
            className={`text-gray-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border z-50 overflow-hidden">
            {/* ... Nội dung menu chính giữ nguyên ... */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || "/src/assets/defaultAvt.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover bg-gray-200"
                />
                <div>
                  <p className="font-semibold text-sm text-gray-800 truncate" title={user.display_name}>
                    {user.display_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate" title={user.email}>
                    {user.email}
                  </p>
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
  );
}