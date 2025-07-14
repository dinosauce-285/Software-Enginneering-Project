function CustomInput({ text, placeholder, type = 'text' }) {
    return (
        <div className="flex flex-col items-start">
            <span className="font-poppins pb-[0.2rem] text-sm text-[#000000]">{text}</span>
            <input className="w-full h-[3rem] pl-[1rem] mb-[1rem] rounded-[0.5rem] border focus:outline-none placeholder:text-[0.8rem] placeholder:font-poppins bg-[#f9f9f2]"  style={{ borderColor: 'rgba(102, 102, 102, 0.33)' }} type={type} placeholder={placeholder} />
        </div>


    );
}
export default CustomInput;