import React, { createContext, useState, useContext, useMemo } from 'react';
const SearchContext = createContext(null);


export function SearchProvider({ children }) {
    const [searchText, setSearchText] = useState('');
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const value = useMemo(() => ({
        searchText,
        setSearchText,
        selectedEmotions,
        setSelectedEmotions,
        fromDate,
        setFromDate,
        toDate,
        setToDate
    }), [searchText, selectedEmotions, fromDate, toDate]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};