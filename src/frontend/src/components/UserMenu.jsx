import { useState } from 'react';
import { FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { FiChevronDown } from 'react-icons/fi';
export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Avatar + Button */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <img src="/src/assets/avt.avif" alt="avatar" className="w-9 h-9 rounded-full object-cover" />
        <FiChevronDown className="text-sm text-gray-500" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
          <ul className="text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <FiSettings /> Cài đặt
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <FiHelpCircle /> Trợ giúp
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 flex items-center gap-2">
              <FiLogOut /> Đăng xuất
            </li>
          </ul>
        </div>
      )}

    </div>
  );
}
