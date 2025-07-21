// src/components/input.jsx

// --- BƯỚC 1: Thêm các props còn thiếu vào danh sách tham số ---
function CustomInput({ text, placeholder, type = 'text', name, value, onChange, required = false }) {
    return (
        <div className="flex flex-col items-start w-full"> {/* Thêm w-full để nó chiếm đủ chiều rộng */}
            <span className="font-poppins pb-[0.2rem] text-sm text-[#000000]">{text}</span>
            <input 
                className="w-full h-[3rem] pl-[1rem] mb-[1rem] rounded-[0.5rem] border focus:outline-none placeholder:text-[0.8rem] placeholder:font-poppins bg-[#f9f9f2]"  
                style={{ borderColor: 'rgba(102, 102, 102, 0.33)' }} 
                
                // --- BƯỚC 2: Gắn các props này vào thẻ input ---
                type={type} 
                placeholder={placeholder}
                name={name}          // Dùng để định danh input
                value={value}        // Giá trị của input được quyết định bởi state của cha
                onChange={onChange}  // Khi gõ, gọi lại hàm của cha để cập nhật state
                required={required}  // Cho phép trình duyệt tự kiểm tra trường bắt buộc
            />
        </div>
    );
}

export default CustomInput;