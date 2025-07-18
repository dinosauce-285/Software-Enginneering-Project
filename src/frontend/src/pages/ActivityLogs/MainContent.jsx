import { useState } from 'react';

const mockUsers = [
  {
    id: 1,
    name: 'Nguyen Le Quang',
    email: 'nlquang@gmail.com',
    action: 'Login',
    target: '–',
    date: 'Jul 15, 2025 - 10:14',
    avatar: '/src/assets/avt1.jpg',
  },
  {
    id: 2,
    name: 'Pham Quang Thinh',
    email: 'pqthinh@gmail.com',
    action: 'Created memory',
    target: 'Trip to Đà Lạt',
    date: 'Jul 14, 2025 - 8:12',
    avatar: '/src/assets/avt2.jpg',
  },
  {
    id: 3,
    name: 'Ly Quoc Thanh',
    email: 'lqthanh@gmail.com',
    action: 'Edited memory',
    target: 'Birthday 2025',
    date: 'Jul 14, 2025 - 6:01',
    avatar: '/src/assets/avt3.jpg',
  },
  {
    id: 4,
    name: 'Huynh Van Sinh',
    email: 'hvsinh@gmail.com',
    action: 'Deleted memory',
    target: 'Training Day',
    date: 'Jul 10, 2025 - 15:09',
    avatar: '/src/assets/avt4.jpg',
  },
  {
    id: 5,
    name: 'Nguyen Tan Van',
    email: 'nvvan@gmail.com',
    action: 'Shared memory',
    target: 'Public game project...',
    date: 'Jul 10, 2025 - 11:45',
    avatar: '/src/assets/avt5.jpg',
  },
  {
    id: 6,
    name: 'Cristiano Ronaldo',
    email: 'ronaldo.cristiano@gmail.com',
    action: 'Changed password',
    target: '–',
    date: 'Jul 9, 2025 - 10:40',
    avatar: '/src/assets/avt6.jpg',
  },
  {
    id: 7,
    name: 'Kylian Mbappe',
    email: 'mbappe@gmail.com',
    action: 'Updated profile info',
    target: '–',
    date: 'Jul 4, 2025 - 10:40',
    avatar: '/src/assets/avt7.jpg',
  },
  {
    id: 8,
    name: 'Lamine Yamal',
    email: 'lamineyamal@gmail.com',
    action: 'Deleted account',
    target: '–',
    date: 'Jun 29, 2025 - 8:40',
    avatar: '/src/assets/avt8.jpg',
  },
  {
    id: 9,
    name: 'Erling Haaland',
    email: 'erlinghaaland@gmail.com',
    action: 'Login',
    target: '–',
    date: 'Jun 29, 2025 - 3:41',
    avatar: '/src/assets/avt9.jpg',
  },
];

export default function MainContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = 10;

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Activities Log</h2>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {user.name}
                </td>
                <td className="p-3 text-blue-600 underline">{user.email}</td>
                <td className="p-3">{user.action}</td>
                <td className="p-3 text-gray-700">{user.target}</td>
                <td className="p-3">{user.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  page === currentPage
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-900 text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-2">
            Show:
            <select className="border px-2 py-1 rounded" value={rowsPerPage} disabled>
              <option>10 rows</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
