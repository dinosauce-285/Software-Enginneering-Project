import { FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import '../../index.css';
import UserMenu from './UserMenu';
import MainContent from "./MainContent";
export default function UserManagementLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Start-Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
        {/* Trái: logo + tên */}
        <div className="flex flex-col items-center justify-center">
          <img src="/src/assets/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium text-back-400">SoulNote</span>
        </div>

        {/* Giữa: menu */}
        <div className="flex gap-6 font-medium text-gray-700">
          <span className="font-bold">User Management</span>
          <span>Activity</span>
        </div>

        {/* Phải: avatar user */}
        <UserMenu />
      </header>
      {/* End-Header */}

      {/*Start-Content */}
      <div className="flex flex-1">
        {/*Start-Sidebar */}
        <aside className="w-2/12 bg-white border-r p-4">
          {/* Avatar + Username */}
          <div className="flex items-center gap-3 mb-6">
            <img src="/src/assets/avt.avif" alt="avatar" className="w-10 h-10 rounded-full bg-gray-300"></img>
            <div>
              <p className="font-medium">Huynh Van Sinh</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>

          {/* Filter options */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 bg-gray-200 text-sm rounded-full shadow-sm focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-600" />
            </div>
            {/* Filter: Permission */}
            <div className="mb-6">
              <div className="bg-gray-200 rounded-full shadow-sm px-4 py-2 flex justify-between items-center">
                <label className="text-sm text-gray-600">
                  Permission <span className="text-orange-500 font-semibold"></span>
                </label>
                <select
                  defaultValue="User"
                  className="text-orange-500 bg-transparent text-sm focus:outline-none cursor-pointer"
                >
                  <option className="text-orange-500">All</option>
                  <option className="text-orange-500">Admin</option>
                  <option className="text-orange-500">User</option>
                </select>
              </div>
            </div>
            {/* Joined filter */}
            <div>
              <div className="bg-gray-200 rounded-full shadow-sm px-4 py-2 flex justify-between items-center">
                <label className="text-sm text-gray-600">
                  Joined
                </label>
                <select
                  defaultValue="Anytime"
                  className="text-orange-500 bg-transparent text-sm focus:outline-none cursor-pointer"
                >
                  <option className="text-orange-500">Anytime</option>
                  <option className="text-orange-500">Last 30 days</option>
                  <option className="text-orange-500">This year</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <MainContent/>
      </div>
    </div>
  );
}
