import { useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

function SearchDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchType, setSearchType] = useState("name");
  const [query, setQuery] = useState("");

  const handleSelect = (type) => {
    setSearchType(type);
    setShowDropdown(false);
  };

  return (
    <div className="mb-6 w-full max-w-[220px] relative"> {/* giới hạn độ rộng tối đa */}
      <div className="bg-gray-200 rounded-full shadow-sm px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 w-full">
          <FiSearch className="text-gray-600 shrink-0" />
          <input
            type="text"
            placeholder="Search items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm text-gray-700 focus:outline-none placeholder-gray-500 w-full"
          />
        </div>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="ml-2 focus:outline-none"
        >
          <FiChevronDown className="text-gray-600" />
        </button>
      </div>

      {/* Dropdown content */}
      {showDropdown && (
        <div className="absolute z-10 mt-1 right-0 bg-white rounded shadow border w-40">
          <button
            className="block text-left w-full px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => handleSelect("name")}
          >
            Search by <span className="font-medium">name</span>
          </button>
          <button
            className="block text-left w-full px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => handleSelect("email")}
          >
            Search by <span className="font-medium">email</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchDropdown;
