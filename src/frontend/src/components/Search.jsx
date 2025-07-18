import React from 'react';

export default function Search() {
    return (
        <header className="flex items-center justify-between py-4 bg-white w-full">
            <div className="flex items-center flex-1 max-w-lg border rounded-md px-2 w-full">
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
                    placeholder="Search..."
                    className="flex-1 px-2 py-2 text-gray-700 focus:outline-none"
                />
            </div>
            <div className="flex items-center absolute right-0 mr-4">
                <img
                    src="src/assets/avt.png"
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <svg
                    className="w-5 h-5 ml-2"
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
        </header >
        // <header className="flex items-center py-4 bg-white w-full px-4">
        //     {/* Search container */}
        //     <div className="flex items-center flex-1 max-w-5xl border border-gray-300 rounded-md px-2">
        //         <svg
        //             xmlns="http://www.w3.org/2000/svg"
        //             fill="none"
        //             viewBox="0 0 24 24"
        //             strokeWidth={1.5}
        //             stroke="currentColor"
        //             className="w-5 h-5 text-gray-500"
        //         >
        //             <path
        //                 strokeLinecap="round"
        //                 strokeLinejoin="round"
        //                 d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        //             />
        //         </svg>
        //         <input
        //             type="text"
        //             placeholder="Search..."
        //             className="flex-1 px-2 py-2 text-gray-700 focus:outline-none"
        //         />
        //     </div>

        //     {/* Avatar + dropdown */}
        //     <div className="flex items-center ml-auto pl-4">
        //         <img
        //             src="src/assets/avt.png"
        //             alt="Avatar"
        //             className="w-8 h-8 rounded-full object-cover"
        //         />
        //         <svg
        //             className="w-5 h-5 ml-2"
        //             fill="none"
        //             viewBox="0 0 24 24"
        //             strokeWidth={1.5}
        //             stroke="currentColor"
        //         >
        //             <path
        //                 strokeLinecap="round"
        //                 strokeLinejoin="round"
        //                 d="m19.5 8.25-7.5 7.5-7.5-7.5"
        //             />
        //         </svg>
        //     </div>
        // </header>




    );
}

