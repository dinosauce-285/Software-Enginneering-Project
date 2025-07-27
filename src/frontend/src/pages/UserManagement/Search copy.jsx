import React, { useState, useRef, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import './datePicker.css'
import avatar from '../assets/avt.avif';
import UserMenu from './UserMenu';
// --- Icon Helpers ---
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>);
const EmotionIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z" /></svg>);
const ChevronDownIcon = () => (<svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>);
const PrevIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
const NextIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

const emotionOptions = [ 'Happy', 'Sad', 'Angry', 'Calm', 'Excited', 'Anxious', 'Loved', 'Tired', 'Confident', 'Nostalgic' ];

const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="relative w-full" onClick={onClick} ref={ref}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><CalendarIcon /></div>
        <input type="text" value={value} readOnly placeholder={placeholder} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer" />
    </div>
));


export default function Search() {

    const [isExpanded, setIsExpanded] = useState(false);
    const [isEmotionDropdownOpen, setEmotionDropdownOpen] = useState(false);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const searchContainerRef = useRef(null);
    const emotionDropdownRef = useRef(null);
    useEffect(() => { function handleClickOutside(event) { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) { setIsExpanded(false); setEmotionDropdownOpen(false); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [searchContainerRef]);
    useEffect(() => { if (!isEmotionDropdownOpen) return; function handleClickOutside(event) { if (emotionDropdownRef.current && !emotionDropdownRef.current.contains(event.target)) { setEmotionDropdownOpen(false); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [isEmotionDropdownOpen]);
    const handleEmotionToggle = (emotion) => { setSelectedEmotions(prev => prev.includes(emotion) ? prev.filter(item => item !== emotion) : [...prev, emotion]); };
    const getEmotionButtonText = () => { if (selectedEmotions.length === 0) return 'Emotion'; if (selectedEmotions.length === 1) return selectedEmotions[0]; return `Emotions (${selectedEmotions.length})`; };
    
   
    const years = Array.from({ length: getYear(new Date()) - 1989 }, (_, i) => 1990 + i).reverse();
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    return (
        <header className="flex items-center justify-between w-full h-24 px-6 md:px-8">
            <div ref={searchContainerRef} className="relative flex-1">
                
            </div>
            <div className="flex items-center ml-6 cursor-pointer shrink-0">
                <UserMenu/>
            </div>
        </header>
    );
}