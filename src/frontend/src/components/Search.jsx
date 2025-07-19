// src/components/Search.jsx

import React from 'react';
// Import avatar từ thư mục assets
import avatar from '../assets/avt.avif';

export default function Search() {
    return (
        <header className="flex items-center justify-between w-full h-24 px-6 md:px-8 max-w-8xl">
            {/* Thanh tìm kiếm */}
            <div className="flex items-center border border-gray-300 rounded-lg px-4 h-14 w-full focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Feeling nostalgic?"
                    className="flex-1 px-3 py-2 text-gray-700 focus:outline-none bg-transparent"
                />
            </div>

    
            <div className="flex items-center ml-6 cursor-pointer">

                <img
                    src={avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <svg
                    className="w-5 h-5 ml-2 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </div>
        </header>
    );
}