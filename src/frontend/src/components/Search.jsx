// import React, { useState, useRef, useEffect, forwardRef } from 'react';
// import DatePicker from 'react-datepicker';
// import { getYear, getMonth } from 'date-fns';
// import "react-datepicker/dist/react-datepicker.css";
// import './datePicker.css'
// import avatar from '../assets/avt.avif';
// import UserMenu from './UserMenu';
// // --- Icon Helpers ---
// const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>);
// const EmotionIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z" /></svg>);
// const ChevronDownIcon = () => (<svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>);
// const PrevIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
// const NextIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

// const emotionOptions = [ 'Happy', 'Sad', 'Angry', 'Calm', 'Excited', 'Anxious', 'Loved', 'Tired', 'Confident', 'Nostalgic' ];

// const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
//     <div className="relative w-full" onClick={onClick} ref={ref}>
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><CalendarIcon /></div>
//         <input type="text" value={value} readOnly placeholder={placeholder} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer" />
//     </div>
// ));


// export default function Search() {

//     const [isExpanded, setIsExpanded] = useState(false);
//     const [isEmotionDropdownOpen, setEmotionDropdownOpen] = useState(false);
//     const [selectedEmotions, setSelectedEmotions] = useState([]);
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);
//     const searchContainerRef = useRef(null);
//     const emotionDropdownRef = useRef(null);
//     useEffect(() => { function handleClickOutside(event) { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) { setIsExpanded(false); setEmotionDropdownOpen(false); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [searchContainerRef]);
//     useEffect(() => { if (!isEmotionDropdownOpen) return; function handleClickOutside(event) { if (emotionDropdownRef.current && !emotionDropdownRef.current.contains(event.target)) { setEmotionDropdownOpen(false); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [isEmotionDropdownOpen]);
//     const handleEmotionToggle = (emotion) => { setSelectedEmotions(prev => prev.includes(emotion) ? prev.filter(item => item !== emotion) : [...prev, emotion]); };
//     const getEmotionButtonText = () => { if (selectedEmotions.length === 0) return 'Emotion'; if (selectedEmotions.length === 1) return selectedEmotions[0]; return `Emotions (${selectedEmotions.length})`; };
    
   
//     const years = Array.from({ length: getYear(new Date()) - 1989 }, (_, i) => 1990 + i).reverse();
//     const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

//     return (
//         <header className="flex items-center justify-between w-full h-24 px-6 md:px-8">
//             <div ref={searchContainerRef} className="relative flex-1">
//                 <div className={`flex items-center border rounded-lg px-4 h-14 w-full bg-white transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300'}`}>
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
//                     <input type="text" placeholder={isExpanded ? "Just type everything related to your memory" : "Feeling nostalgic?"} className="flex-1 px-3 py-2 text-gray-700 focus:outline-none bg-transparent" onFocus={() => setIsExpanded(true)} />
//                 </div>
//                 {isExpanded && (
//                     <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 shadow-lg rounded-lg p-4 mt-2 animate-fade-in-down">
//                         <div className="flex flex-col sm:flex-row items-center gap-3">
//                             <div className="w-full sm:flex-1">
//                                 <DatePicker
//                                     selected={fromDate}
//                                     onChange={(date) => setFromDate(date)}
//                                     selectsStart
//                                     startDate={fromDate}
//                                     endDate={toDate}
//                                     dateFormat="dd/MM/yyyy"
//                                     isClearable
//                                     customInput={<CustomDateInput placeholder="From" />}
//                                     popperClassName="new-datepicker-theme-popper"
                        
//                                     renderCustomHeader={({
//                                         date,
//                                         changeYear,
//                                         changeMonth,
//                                         decreaseMonth,
//                                         increaseMonth,
//                                     }) => (
//                                         <div className="new-datepicker-theme">
//                                             <div className="datepicker-header">
//                                                 <button onClick={decreaseMonth} type="button" className="datepicker-nav-button">
//                                                     <PrevIcon />
//                                                 </button>
//                                                 <div className="datepicker-select-wrapper">
//                                                     <select
//                                                         value={months[getMonth(date)]}
//                                                         onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
//                                                         className="datepicker-select"
//                                                     >
//                                                         {months.map(option => <option key={option} value={option}>{option}</option>)}
//                                                     </select>
//                                                     <select
//                                                         value={getYear(date)}
//                                                         onChange={({ target: { value } }) => changeYear(value)}
//                                                         className="datepicker-select"
//                                                     >
//                                                         {years.map(option => <option key={option} value={option}>{option}</option>)}
//                                                     </select>
//                                                 </div>
//                                                 <button onClick={increaseMonth} type="button" className="datepicker-nav-button">
//                                                     <NextIcon />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 />
//                             </div>
//                             <div className="w-full sm:flex-1">
//                                 <DatePicker
//                                     selected={toDate}
//                                     onChange={(date) => setToDate(date)}
//                                     selectsEnd
//                                     startDate={fromDate}
//                                     endDate={toDate}
//                                     minDate={fromDate}
//                                     dateFormat="dd/MM/yyyy"
//                                     isClearable
//                                     customInput={<CustomDateInput placeholder="To" />}
//                                     popperClassName="new-datepicker-theme-popper"
//                                     renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, }) => (
//                                       <div className="new-datepicker-theme"> <div className="datepicker-header"> <button onClick={decreaseMonth} type="button" className="datepicker-nav-button"> <PrevIcon /> </button> <div className="datepicker-select-wrapper"> <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="datepicker-select"> {months.map(option => <option key={option} value={option}>{option}</option>)} </select> <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)} className="datepicker-select"> {years.map(option => <option key={option} value={option}>{option}</option>)} </select> </div> <button onClick={increaseMonth} type="button" className="datepicker-nav-button"> <NextIcon /> </button> </div> </div>
//                                     )}
//                                 />
//                             </div>
                
//                             <div ref={emotionDropdownRef} className="relative w-full sm:flex-1"> <button onClick={() => setEmotionDropdownOpen(prev => !prev)} className="w-full flex items-center justify-between pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-left focus:ring-blue-500 focus:border-blue-500 focus:outline-none"> <span className={selectedEmotions.length > 0 ? "text-gray-800" : "text-gray-500"}>{getEmotionButtonText()}</span> <ChevronDownIcon /> </button> <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><EmotionIcon /></div> {isEmotionDropdownOpen && ( <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto"> {emotionOptions.map((emotion) => ( <label key={emotion} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"> <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedEmotions.includes(emotion)} onChange={() => handleEmotionToggle(emotion)} /> <span className="ml-3">{emotion}</span> </label> ))} </div> )} </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <div className="flex items-center ml-6 cursor-pointer shrink-0">
//                 {/* <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
//                 <svg className="w-5 h-5 ml-2 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg> */}
//                 <UserMenu/>
//             </div>
//         </header>
//     );
// }



import React, { useState, useRef, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import './datePicker.css'
import UserMenu from './UserMenu';

// ===================================================================
// BƯỚC 1: EXPORT TẤT CẢ CÁC COMPONENT CON VÀ HELPER
// Thêm từ khóa 'export' vào trước mỗi component/icon.
// ===================================================================

export const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>);

export const EmotionIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z" /></svg>);

export const ChevronDownIcon = () => (<svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>);

export const PrevIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);

export const NextIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

export const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="relative w-full" onClick={onClick} ref={ref}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><CalendarIcon /></div>
        <input type="text" value={value} readOnly placeholder={placeholder} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer" />
    </div>
));

// ===================================================================
// BƯỚC 2: COMPONENT SEARCH CHÍNH
// ===================================================================

const emotionOptions = [ 'Happy', 'Sad', 'Angry', 'Calm', 'Excited', 'Anxious', 'Loved', 'Tired', 'Confident', 'Nostalgic' ];

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
                <div className={`flex items-center border rounded-lg px-4 h-14 w-full bg-white transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                    <input type="text" placeholder={isExpanded ? "Just type everything related to your memory" : "Feeling nostalgic?"} className="flex-1 px-3 py-2 text-gray-700 focus:outline-none bg-transparent" onFocus={() => setIsExpanded(true)} />
                </div>
                {isExpanded && (
                    <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 shadow-lg rounded-lg p-4 mt-2 animate-fade-in-down">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-full sm:flex-1">
                                <DatePicker
                                    selected={fromDate}
                                    onChange={(date) => setFromDate(date)}
                                    selectsStart
                                    startDate={fromDate}
                                    endDate={toDate}
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                    customInput={<CustomDateInput placeholder="From" />}
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
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                    customInput={<CustomDateInput placeholder="To" />}
                                    popperClassName="new-datepicker-theme-popper"
                                    renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
                                      <div className="new-datepicker-theme"><div className="datepicker-header"><button onClick={decreaseMonth} type="button" className="datepicker-nav-button"><PrevIcon /></button><div className="datepicker-select-wrapper"><select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="datepicker-select">{months.map(option => <option key={option} value={option}>{option}</option>)}</select><select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} className="datepicker-select">{years.map(option => <option key={option} value={option}>{option}</option>)}</select></div><button onClick={increaseMonth} type="button" className="datepicker-nav-button"><NextIcon /></button></div></div>
                                    )}
                                />
                            </div>
                            <div ref={emotionDropdownRef} className="relative w-full sm:flex-1"> <button onClick={() => setEmotionDropdownOpen(prev => !prev)} className="w-full flex items-center justify-between pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-left focus:ring-blue-500 focus:border-blue-500 focus:outline-none"> <span className={selectedEmotions.length > 0 ? "text-gray-800" : "text-gray-500"}>{getEmotionButtonText()}</span> <ChevronDownIcon /> </button> <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><EmotionIcon /></div> {isEmotionDropdownOpen && ( <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto"> {emotionOptions.map((emotion) => ( <label key={emotion} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"> <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedEmotions.includes(emotion)} onChange={() => handleEmotionToggle(emotion)} /> <span className="ml-3">{emotion}</span> </label> ))} </div> )} </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center ml-6 cursor-pointer shrink-0">
                <UserMenu/>
            </div>
        </header>
    );
}
