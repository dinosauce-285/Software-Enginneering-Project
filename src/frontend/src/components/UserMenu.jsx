// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
// import { logoutUser } from '../services/api';

// export default function UserMenu() {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsOpen(false);
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
//     setIsOpen(false);
//   }

//   return (
//     <div className="relative" ref={menuRef}>
//       <button
//         className="flex items-center gap-2 cursor-pointer p-1 rounded-full transition-colors duration-200 hover:bg-gray-100"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <img
//           src="/src/assets/avt.avif"
//           alt="User Avatar"
//           className="w-9 h-9 rounded-full object-cover"
//         />
//         <FiChevronDown
//           className={`text-sm text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
//         />
//       </button>

//       <div
//         className={`
//           absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border z-50 overflow-hidden
//           transition-all duration-300 ease-in-out
//           ${isOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}
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
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
import { logoutUser } from '../services/api';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 cursor-pointer p-1 rounded-full transition-colors duration-200 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="/src/assets/avt.avif"
          alt="User Avatar"
          className="w-9 h-9 rounded-full object-cover"
        />
        <FiChevronDown
          className={`text-sm text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`
          absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border z-50 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <img
                    src="/src/assets/avt.avif"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <p className="font-semibold text-sm text-gray-800">John Doe</p>
                    <p className="text-xs text-gray-500">john.doe@example.com</p>
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
    </div>
  );
}
