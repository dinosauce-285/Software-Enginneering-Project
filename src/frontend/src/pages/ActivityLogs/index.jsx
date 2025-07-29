import { FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import '../../index.css';
import { Link } from "react-router-dom";
import UserMenu from '../../components/UserMenu'
import MainContent from "./MainContent";
import SearchFilterDropdown from "./search";
import DateRangeFilter from "./DateRange";
export default function ActivityLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">

      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
        <div className="flex flex-col items-center justify-center">
          <img src="/src/assets/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium text-back-400">SoulNote</span>
        </div>

        <div className="flex gap-6 font-medium text-gray-700">
          <Link to="/user-management" className='font-inter'>User Management</Link>
          <span className="font-bold">Activity</span>
        </div>


        <UserMenu />
      </header>



      <div className="flex flex-1">

        <aside className="w-2/12 bg-white border-r p-4">

          <div className="flex items-center gap-3 mb-6">
            <div>
              <p className="font-medium">Activities Log</p>

            </div>
          </div>


          <div className="space-y-4">
            <SearchFilterDropdown />

            <div className="mb-6">
              <div className="bg-gray-200 rounded-full shadow-sm px-4 py-2 flex justify-between items-center">
                <label className="text-sm text-gray-600">
                  Action: <span className="text-orange-400 font-semibold"></span>
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
            <DateRangeFilter />
          </div>
        </aside>


        <div className="w-full lg:w-10/12 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
}
