// src/components/CustomSelect.jsx

import { FiChevronDown } from 'react-icons/fi';

function CustomSelect({ label, name, value, onChange, required, children }) {
  return (
    <div className="flex-1">
      {/* Label cho ô select */}
      <label htmlFor={name} className="block mb-1.5 text-xs font-poppins text-gray-600">
        {label}
      </label>
      
      {/* Container để định vị mũi tên tùy chỉnh */}
      <div className="relative">
        {/* Thẻ select đã được làm đẹp và ẩn mũi tên mặc định */}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="
            peer w-full p-2.5 text-sm text-gray-800 bg-white 
            border border-gray-300 rounded-lg appearance-none 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all
          "
        >
          {children}
        </select>
        
        {/* Mũi tên tùy chỉnh, sẽ xoay khi select được focus */}
        <div className="
          absolute inset-y-0 right-0 flex items-center px-3 
          text-gray-500 pointer-events-none
          peer-focus:rotate-180 transition-transform duration-300
        ">
          <FiChevronDown />
        </div>
      </div>
    </div>
  );
}

export default CustomSelect;