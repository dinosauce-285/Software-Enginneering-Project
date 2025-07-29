// src/components/LocationSearchInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const LocationSearchInput = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeout = useRef(null);

  // Xử lý khi người dùng gõ
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Debouncing: Chờ 300ms sau khi người dùng ngừng gõ rồi mới gọi API
    clearTimeout(searchTimeout.current);
    if (newQuery.length > 2) {
      searchTimeout.current = setTimeout(() => {
        fetchSuggestions(newQuery);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

  // Gọi Mapbox API
  const fetchSuggestions = async (searchQuery) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            autocomplete: true,
            limit: 5,
          },
        }
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  // Xử lý khi người dùng chọn một địa điểm
  const handleSelect = (suggestion) => {
    const locationName = suggestion.place_name;
    setQuery(locationName); // Cập nhật input
    setSuggestions([]); // Ẩn danh sách
    setIsFocused(false);
    onLocationSelect(locationName); // Gửi địa điểm đã chọn về component cha
  };

  return (
    <div className="relative w-full">
        
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay để có thể click vào suggestion
        placeholder="Add a location..."
        className="bg-gray-100 w-full px-4 py-2 rounded shadow focus:outline-none"
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {item.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};