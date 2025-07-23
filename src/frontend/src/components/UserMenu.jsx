import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <<< 1. Import hook để chuyển hướng
import { FiSettings, FiHelpCircle, FiLogOut, FiChevronDown } from "react-icons/fi";
import { logoutUser } from '../services/api'; // <<< 2. Import hàm đăng xuất

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // <<< 3. Khởi tạo hook

  // --- 4. TẠO HÀM XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = () => {
    logoutUser(); // Xóa token khỏi localStorage
    // Không cần alert ở đây, việc chuyển trang đã là thông báo rõ ràng
    navigate('/login'); // Chuyển hướng người dùng về trang đăng nhập
  };

  return (
    <div className="relative">
      {/* Avatar + Button */}
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src="/src/assets/avt.avif" 
          alt="avatar" 
          className="w-9 h-9 rounded-full object-cover" 
        />
        <FiChevronDown className="text-sm text-gray-500" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50"
          // Thêm onMouseLeave để menu tự đóng khi chuột rời đi (trải nghiệm tốt hơn)
          onMouseLeave={() => setIsOpen(false)} 
        >
          <ul className="text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <FiSettings /> Cài đặt
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <FiHelpCircle /> Trợ giúp
            </li>
            
            {/* --- 5. GẮN HÀM onClick VÀO MỤC ĐĂNG XUẤT --- */}
            <li 
              onClick={handleLogout} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 flex items-center gap-2"
            >
              <FiLogOut /> Đăng xuất
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}