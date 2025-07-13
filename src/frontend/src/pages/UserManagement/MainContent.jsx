import { useState } from 'react';

const mockUsers = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: ['Nguyen Le Quang', 'Pham Quang Thinh', 'Ly Quoc Thanh', 'Huynh Van Sinh', 'Nguyen Tan Van', 'Cristiano Ronaldo', 'Kylian Mbappe', 'Lamine Yamal', 'Erling Haaland'][i] || `User ${i + 1}`,
    email: `user${i + 1}@gmail.com`,
    location: ['Los Angeles, CA', 'Cheyenne, WY', 'Cheyenne, WY', 'Syracuse, NY', 'Luanda, AN', 'Lagos, NG', 'London, ENG', 'São Paulo, BR', 'Huambo, Angola'][i] || 'City, Country',
    joined: ['October 2, 2010', 'October 3, 2011', 'May 20, 2015', 'July 14, 2015', 'October, 2016', 'June 5, 2016', 'June 15, 2015', 'March 13, 2018', 'March 14, 2018'][i] || 'Date',
    role: i < 3 ? 'Admin' : 'User',
    avatar: `https://www.google.com/imgres?q=avatar%20%C4%91%E1%BA%B9p&imgurl=https%3A%2F%2Fjbagy.me%2Fwp-content%2Fuploads%2F2025%2F03%2Fhinh-anh-cute-avatar-vo-tri-3.jpg&imgrefurl=https%3A%2F%2Fjbagy.me%2Favatar-vo-tri-cute%2F%3Fsrsltid%3DAfmBOopbVP0QQ1iWD4CEYCRCKIWAthumyM9DqSPLRi4fRSoIgnGjSg9I&docid=3UCpOs3lQcf5WM&tbnid=f5vx0IAcqRqmTM&vet=12ahUKEwjc3YHd1LmOAxXlSWwGHd9RAxMQM3oECE8QAA..i&w=800&h=800&hcb=2&ved=2ahUKEwjc3YHd1LmOAxXlSWwGHd9RAxMQM3oECE8QAA`,
}));

export default function MainContent() {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const totalPages = 10;

    return (
        <div className="w-full p-6 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">User Management Table</h2>
                <div className="flex gap-2">
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md shadow">📥 Export</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow">🗑 Delete User</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow">➕ New User</button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow p-4 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3"><input type="checkbox" /></th>
                            <th className="p-3">Full Name</th>
                            <th className="p-3">Email Address</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Joined</th>
                            <th className="p-3">Permissions</th>
                            <th className="p-3 text-right">⋮</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-3"><input type="checkbox" /></td>
                                <td className="p-3 flex items-center gap-2">
                                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                    {user.name}
                                </td>
                                <td className="p-3 text-blue-600 underline">{user.email}</td>
                                <td className="p-3">📍 {user.location}</td>
                                <td className="p-3">{user.joined}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${user.role === 'Admin' ? 'bg-red-200 text-red-700' : 'bg-blue-100 text-blue-600'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3 text-right">⋮</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* PAGINATION bên trong bảng */}
                <div className="flex items-center justify-between mt-4 px-2">
                    {/* Page buttons */}
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-full text-sm font-medium ${page === currentPage
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-900 text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Rows per page */}
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                        Show:
                        <select
                            className="border px-2 py-1 rounded"
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                        >
                            <option value={10}>10 rows</option>
                            <option value={20}>20 rows</option>
                            <option value={50}>50 rows</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
