// src/components/MediaButton.jsx

function MediaButton({ children, onClick, disabled, type = 'button' }) {
    return (
        <button
            // Thuộc tính type='button' ngăn nút này submit form.
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="hover:bg-gray-700 transition-all duration-200 bg-black text-white h-[3rem] w-[20rem] rounded-[2rem] flex flex-row justify-center items-center mb-[2%] disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            {children}
        </button>
    );
}

export default MediaButton;