import React, { forwardRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
import { format } from 'date-fns';


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

export default function DateRangeFilter({ startDate, endDate, setFilters }) {

    const handleClearDates = () => {
        setFilters(prev => ({ ...prev, startDate: null, endDate: null }));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date Range
                </label>
                {(startDate || endDate) && (
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
                    selected={startDate}
                    onChange={(date) => setFilters(p => ({...p, startDate: date}))}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate || new Date()}
                    dateFormat="d MMM, yyyy"
                    placeholderText="From"
                    wrapperClassName="w-full"
                    customInput={
                        <FilterButton 
                            isActive={!!startDate} 
                            placeholder="From"
            
                        />
                    }
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setFilters(p => ({...p, endDate: date}))}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    maxDate={new Date()} 
                    dateFormat="d MMM, yyyy"
                    placeholderText="To"
                    wrapperClassName="w-full"
                    customInput={
                        <FilterButton 
                            isActive={!!endDate}
                            placeholder="To"
                        />
                    }
                />
            </div>
        </div>
    );
}