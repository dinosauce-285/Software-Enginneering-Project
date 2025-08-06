import React, { useState, useRef, useEffect, forwardRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { format } from 'date-fns';

const FilterButton = forwardRef(({ onClick, label, isActive }, ref) => (
    <button
        onClick={onClick}
        ref={ref}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-lg transition ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600/50'}`}
    >
        <FiCalendar className="w-4 h-4" />
        <span>{label}</span>
    </button>
));

export default function DateRangeFilter({ startDate, endDate, setFilters }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getButtonText = () => {
        if (startDate && endDate) return `${format(startDate, 'd MMM')} - ${format(endDate, 'd MMM, yy')}`;
        if (startDate) return `From ${format(startDate, 'd MMM, yy')}`;
        return 'Anytime';
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 flex items-center justify-between w-full pl-3.5 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition shadow-sm"
            >
                <div className="flex items-center gap-2"><FiCalendar className="w-4 h-4 text-gray-400" /><span>{getButtonText()}</span></div>
                <span className={`inline-block transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><FiChevronDown className="w-4 h-4 text-gray-400" /></span>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-4 mt-2">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <DatePicker selected={startDate} onChange={(date) => setFilters(p => ({...p, startDate: date}))} selectsStart startDate={startDate} endDate={endDate} maxDate={endDate} wrapperClassName="w-full" customInput={<FilterButton label={startDate ? format(startDate, 'd MMM, yyyy') : 'From'} isActive={!!startDate} />} />
                        <DatePicker selected={endDate} onChange={(date) => setFilters(p => ({...p, endDate: date}))} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} wrapperClassName="w-full" customInput={<FilterButton label={endDate ? format(endDate, 'd MMM, yyyy') : 'To'} isActive={!!endDate} />} />
                    </div>
                </div>
            )}
        </div>
    );
}