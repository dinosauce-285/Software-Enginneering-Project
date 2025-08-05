import React, { useState, useRef, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth, format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import './datePicker.css';
import UserMenu from './UserMenu';
import { useSearch } from '../contexts/SearchContext.jsx';
import { getEmotions } from '../services/api';
import { FiX } from 'react-icons/fi';

// === PHỤC HỒI LẠI TÊN ĐÚNG ===
export const CalendarIcon = () => (<svg xmlns="http://www.worg/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>);
export const EmotionIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z" /></svg>);
export const ChevronDownIcon = () => (<svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>);
export const PrevIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
export const NextIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

// === PHỤC HỒI LẠI COMPONENT CUSTOMDATEINPUT ĐÚNG ===
export const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="relative w-full" onClick={onClick} ref={ref}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><CalendarIcon /></div>
        <input
            type="text"
            value={value}
            readOnly
            placeholder={placeholder}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer"
        />
    </div>
));
const FilterPill = ({ label, onRemove }) => (
    <div className="flex items-center bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
        <span>{label}</span>
        <button onClick={onRemove} className="ml-2 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
            <FiX size={14} />
        </button>
    </div>
);
const FilterButton = forwardRef(({ icon, label, isActive, onClick }, ref) => (
    <button
        ref={ref}
        onClick={onClick}
        className={`
            flex items-center justify-between w-full px-3 py-2 text-sm font-medium border rounded-lg 
            transition-colors duration-200
            ${isActive
                ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
            }
        `}
    >
        <div className="flex items-center gap-2 truncate">
            {icon}
            <span className="truncate">{label}</span>
        </div>
        <ChevronDownIcon />
    </button>
));

export default function Header() {
    // ... code của component Header giữ nguyên ...
    const {
        searchText, setSearchText,
        selectedEmotions, setSelectedEmotions,
        fromDate, setFromDate,
        toDate, setToDate
    } = useSearch();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isEmotionDropdownOpen, setEmotionDropdownOpen] = useState(false);
    const [emotionOptions, setEmotionOptions] = useState([]);

    const searchContainerRef = useRef(null);
    const emotionDropdownRef = useRef(null);

    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                const emotions = await getEmotions();
                setEmotionOptions(emotions);
            } catch (error) {
                console.error("Failed to fetch emotions for search bar", error);
            }
        };
        fetchEmotions();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsExpanded(false);
                setEmotionDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchContainerRef]);

    useEffect(() => {
        if (!isEmotionDropdownOpen) return;
        function handleClickOutside(event) {
            if (emotionDropdownRef.current && !emotionDropdownRef.current.contains(event.target)) {
                setEmotionDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isEmotionDropdownOpen]);

    const handleEmotionToggle = (emotionId) => {
        setSelectedEmotions(prev => prev.includes(emotionId) ? prev.filter(id => id !== emotionId) : [...prev, emotionId]);
    };

    const getEmotionButtonText = () => {
        if (selectedEmotions.length === 0) return 'Emotion';
        if (selectedEmotions.length === 1) {
            const selectedId = selectedEmotions[0];
            const emotion = emotionOptions.find(opt => opt.emotionID === selectedId);
            return emotion ? emotion.name : 'Emotion';
        }
        return `Emotions (${selectedEmotions.length})`;
    };

    const hasActiveFilters = fromDate || toDate || selectedEmotions.length > 0;

    const clearAllFilters = () => {
        setFromDate(null);
        setToDate(null);
        setSelectedEmotions([]);
    };

    const formatDateRangeForPill = () => {
        if (!fromDate) return '';
        const start = format(fromDate, 'MMM d, yyyy');
        if (!toDate || fromDate.getTime() === toDate.getTime()) return start;
        const end = format(toDate, 'MMM d, yyyy');
        return `${start} - ${end}`;
    };

    const years = Array.from({ length: getYear(new Date()) - 1989 }, (_, i) => 1990 + i).reverse();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <>
            <header className="flex items-center justify-between w-full h-24 px-6 md:px-8">
                <div ref={searchContainerRef} className="relative flex-1">
                    <div className={`flex items-center border rounded-lg px-4 h-14 w-full bg-white  dark:bg-gray-700/60 transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 dark:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>

                        <input
                            type="text"
                            placeholder={isExpanded ? "Search tags, content, title..." : "Feeling nostalgic?"}
                            className="flex-1 px-3 py-2 text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none dark:placeholder-gray-400"
                            onFocus={() => setIsExpanded(true)}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    {isExpanded && (
                        <div className="absolute top-full left-0 right-0 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-4 mt-2 animate-fade-in-down">
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="w-full sm:flex-1">
                                    <DatePicker
                                        selected={fromDate}
                                        onChange={(date) => setFromDate(date)}
                                        selectsStart
                                        startDate={fromDate}
                                        endDate={toDate}
                                        maxDate={toDate}
                                        wrapperClassName="w-full"
                                        customInput={
                                            <FilterButton
                                                icon={<CalendarIcon />}
                                                label={fromDate ? format(fromDate, 'd MMM, yyyy') : 'From'}
                                                isActive={!!fromDate}
                                            />
                                        }
                                        popperClassName="new-datepicker-theme-popper"
                                        renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
                                            <div className="new-datepicker-theme"><div className="datepicker-header"><button onClick={decreaseMonth} type="button" className="datepicker-nav-button"><PrevIcon /></button><div className="datepicker-select-wrapper"><select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="datepicker-select">{months.map(option => <option key={option} value={option}>{option}</option>)}</select><select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} className="datepicker-select">{years.map(option => <option key={option} value={option}>{option}</option>)}</select></div><button onClick={increaseMonth} type="button" className="datepicker-nav-button"><NextIcon /></button></div></div>
                                        )}
                                    />
                                </div>
                                <div className="w-full sm:flex-1">
                                    <DatePicker
                                        selected={toDate}
                                        onChange={(date) => setToDate(date)}
                                        selectsEnd
                                        startDate={fromDate}
                                        endDate={toDate}
                                        minDate={fromDate}
                                        wrapperClassName="w-full"
                                        customInput={
                                            <FilterButton
                                                icon={<CalendarIcon />}
                                                label={toDate ? format(toDate, 'd MMM, yyyy') : 'To'}
                                                isActive={!!toDate}
                                            />
                                        }
                                        popperClassName="new-datepicker-theme-popper"
                                        renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
                                            <div className="new-datepicker-theme"><div className="datepicker-header"><button onClick={decreaseMonth} type="button" className="datepicker-nav-button"><PrevIcon /></button><div className="datepicker-select-wrapper"><select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="datepicker-select">{months.map(option => <option key={option} value={option}>{option}</option>)}</select><select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} className="datepicker-select">{years.map(option => <option key={option} value={option}>{option}</option>)}</select></div><button onClick={increaseMonth} type="button" className="datepicker-nav-button"><NextIcon /></button></div></div>
                                        )}
                                    />
                                </div>
                                <div className="relative w-full sm:flex-1">
                                    <FilterButton
                                        onClick={() => setEmotionDropdownOpen(prev => !prev)}
                                        icon={<EmotionIcon />}
                                        label={getEmotionButtonText()}
                                        isActive={selectedEmotions.length > 0}
                                    />
                                    {isEmotionDropdownOpen && (
                                        // <div ref={emotionDropdownRef} className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
                                        <div ref={emotionDropdownRef} className="absolute top-full mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
                                            {emotionOptions.map((emotion) => (
                                                <label key={emotion.emotionID} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-600 checked:bg-blue-600"
                                                        checked={selectedEmotions.includes(emotion.emotionID)}
                                                        onChange={() => handleEmotionToggle(emotion.emotionID)}
                                                    />
                                                    <span className="ml-3">{emotion.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center ml-6 cursor-pointer shrink-0">
                    <UserMenu />
                </div>
            </header>

            {hasActiveFilters && (
                <div className="px-6 md:px-8 -mt-4 pb-4">
                    <div className="flex items-center gap-2 flex-wrap border-t border-gray-200 dark:border-gray-700 pt-3">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mr-2">Filters:</span>
                        {fromDate && (
                            <FilterPill
                                label={formatDateRangeForPill()}
                                onRemove={() => { setFromDate(null); setToDate(null); }}
                            />
                        )}
                        {selectedEmotions.map(id => {
                            const emotion = emotionOptions.find(opt => opt.emotionID === id);
                            return emotion ? (
                                <FilterPill
                                    key={id}
                                    label={emotion.name}
                                    onRemove={() => handleEmotionToggle(id)}
                                />
                            ) : null;
                        })}
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-blue-600 hover:underline ml-auto"
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}