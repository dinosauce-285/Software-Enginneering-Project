// src/components/LocationSearchInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const LocationSearchInput = ({ onLocationSelect, className, placeholder }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeout = useRef(null);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    clearTimeout(searchTimeout.current);
    if (newQuery.length > 2) {
      searchTimeout.current = setTimeout(() => {
        fetchSuggestions(newQuery);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

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

  const handleSelect = (suggestion) => {
    const locationName = suggestion.place_name;
    setQuery(locationName);
    setSuggestions([]);
    setIsFocused(false);
    onLocationSelect(locationName);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
       
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} 
        placeholder={placeholder || "Add a location..."}
        className={className || "w-full px-4 py-2 bg-gray-100 rounded shadow focus:outline-none"}
      />
      
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {item.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};