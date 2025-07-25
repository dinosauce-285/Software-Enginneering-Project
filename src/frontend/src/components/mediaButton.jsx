// src/components/MediaButton.jsx

function MediaButton({ children, onClick, disabled, type = 'button' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}

            className="w-full h-12 flex justify-center items-center bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg shadow-sm
                       transition-all duration-300
                       hover:border-gray-400 hover:shadow-md hover:-translate-y-1
                       active:bg-gray-100
                       disabled:bg-gray-200 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
            {children}
        </button>
    );
}

export default MediaButton;