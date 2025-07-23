
function CustomInput({ text, placeholder, type = 'text', name, value, onChange, required = false }) {
    return (
        <div className="flex flex-col items-start w-full">
        
            <label htmlFor={name} className="font-poppins pb-[0.2rem] text-sm text-[#000000]">
                {text}
    
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
                id={name} 
                className="w-full h-[3rem] pl-[1rem] mb-[1rem] rounded-[0.5rem] border focus:outline-none placeholder:text-[0.8rem] placeholder:font-poppins bg-[#f9f9f2]"  
                style={{ borderColor: 'rgba(102, 102, 102, 0.33)' }} 
                
                type={type} 
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                required={required} 
            />
        </div>
    );
}

export default CustomInput;