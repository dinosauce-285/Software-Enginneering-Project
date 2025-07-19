function MediaButton({children})
{
    return (
        <button className="hover:bg-gray-700 transition-all duration-200 bg-black text-white h-[3rem] w-[20rem] rounded-[2rem] flex flex-row justify-center items-center mb-[2%]">{children}</button>
    )
}
export default MediaButton;