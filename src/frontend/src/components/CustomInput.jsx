// src/components/CustomInput.jsx

function CustomInput({ text, placeholder, type = 'text', name, value, onChange, required = false, error = null, ...props }) {
    const baseClasses = "w-full h-12 px-4 rounded-lg border bg-white transition-all duration-200 ease-in-out focus:outline-none";
    
    const borderClasses = error 
        ? "border-red-400 focus:ring-2 focus:ring-red-300" 
        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
    
    return (
        <div className="flex flex-col items-start w-full">
            <label htmlFor={name} className="font-medium text-sm text-gray-700 mb-1.5">
                {text}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
                id={name} 
                className={`${baseClasses} ${borderClasses} placeholder:text-gray-400`}
                type={type} 
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                {...props} 
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default CustomInput;