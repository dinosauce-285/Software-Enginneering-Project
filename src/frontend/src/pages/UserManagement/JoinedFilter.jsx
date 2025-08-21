import React, { forwardRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";

const FilterButton = forwardRef(({ value, onClick, placeholder, isActive }, ref) => (
    <button
        onClick={onClick}
        ref={ref}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-lg transition ${
            isActive 
            ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200' 
            : 'bg-white dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600/50'
        }`}
    >
        <FiCalendar className="w-4 h-4" />
        <span>{value || placeholder}</span>
    </button>
));

export default function JoinedFilter({ filters, setFilters }) {
    
    const fromDate = filters.joinedStartDate;
    const toDate = filters.joinedEndDate;

    const handleClearDates = () => {
        setFilters(prev => ({ ...prev, joinedStartDate: null, joinedEndDate: null }));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Joined Date
                </label>
                {(fromDate || toDate) && (
                    <button 
                        onClick={handleClearDates}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="flex items-center gap-3">
                <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFilters(p => ({...p, joinedStartDate: date}))}
                    selectsStart
                    startDate={fromDate}
                    endDate={toDate}
                    maxDate={toDate || new Date()}
                    dateFormat="d MMM, yyyy"
                    placeholderText="From"
                    wrapperClassName="w-full"
                    customInput={
                        <FilterButton 
                            isActive={!!fromDate} 
                            placeholder="From"
                        />
                    }
                />

                <DatePicker
                    selected={toDate}
                    onChange={(date) => setFilters(p => ({...p, joinedEndDate: date}))}
                    selectsEnd
                    startDate={fromDate}
                    endDate={toDate}
                    minDate={fromDate}
                    maxDate={new Date()}
                    dateFormat="d MMM, yyyy"
                    placeholderText="To"
                    wrapperClassName="w-full"
                    customInput={
                        <FilterButton 
                            isActive={!!toDate}
                            placeholder="To"
                        />
                    }
                />
            </div>
        </div>
    );
}