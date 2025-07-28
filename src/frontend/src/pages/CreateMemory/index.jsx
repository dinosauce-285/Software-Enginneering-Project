// import { useState, useEffect, useRef, forwardRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../../index.css';
// import AppLayout from '../../components/AppLayout';

// import {
//     FaImage, FaPaperclip, FaSmile, FaBold, FaUnderline, FaItalic,
//     FaAlignLeft, FaAlignCenter, FaAlignRight, FaRedo, FaUndo,
//     FaMapMarkerAlt, FaTag, FaCalendarAlt
// } from 'react-icons/fa';
// import { FiChevronDown, FiX } from 'react-icons/fi';
// import DatePicker from 'react-datepicker';
// import { getYear, getMonth } from 'date-fns';

// import "react-datepicker/dist/react-datepicker.css";
// import '../../components/datePicker.css';

// import { createMemory, getEmotions, uploadMediaForMemory } from '../../services/api';

// const PrevIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
// const NextIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

// const CustomDateInput = forwardRef(({ value, onClick, isOpen }, ref) => (
//     <div onClick={onClick} ref={ref} className="bg-gray-100 w-full min-w-[130px] px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
//         <FaCalendarAlt className="text-gray-500" />
//         <span className="text-sm text-gray-700 flex-grow">{value || 'Date'}</span>
//         <FiChevronDown className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
//     </div>
// ));

// export default function CreateMemory() {
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [selectedEmotionId, setSelectedEmotionId] = useState('');
//     const [tags, setTags] = useState('');
//     const [selectedDate, setSelectedDate] = useState(new Date());

//     const [mediaFiles, setMediaFiles] = useState([]);
//     const [mediaPreviews, setMediaPreviews] = useState([]);

//     const [emotions, setEmotions] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [isEmotionDropdownOpen, setIsEmotionDropdownOpen] = useState(false);
//     const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

//     const emotionDropdownRef = useRef(null);
//     const fileInputRef = useRef(null);
//     const navigate = useNavigate();

//     const years = Array.from({ length: getYear(new Date()) - 1989 }, (_, i) => 1990 + i).reverse();
//     const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//     useEffect(() => {
//         const fetchEmotions = async () => {
//             try {
//                 const data = await getEmotions();
//                 setEmotions(data);
//                 if (data.length > 0) setSelectedEmotionId(data[0].emotionID);
//             } catch (err) {
//                 console.error("Failed to fetch emotions", err);
//                 setError("Could not load emotions.");
//             }
//         };
//         fetchEmotions();
//     }, []);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (emotionDropdownRef.current && !emotionDropdownRef.current.contains(event.target)) {
//                 setIsEmotionDropdownOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleFileChange = (e) => {
//         const newFiles = Array.from(e.target.files);
//         if (newFiles.length > 0) {
//             setMediaFiles(prevFiles => [...prevFiles, ...newFiles]);
//             const newPreviews = newFiles.map(file => ({
//                 id: `${file.name}-${file.lastModified}`,
//                 name: file.name,
//                 url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
//                 type: file.type.startsWith('image/') ? 'IMAGE' : 'OTHER',
//             }));
//             setMediaPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
//         }
//     };

//     const handleRemoveFile = (previewId) => {
//         const previewToRemove = mediaPreviews.find(p => p.id === previewId);
//         if (!previewToRemove) return;
//         setMediaFiles(prevFiles => prevFiles.filter(file => file.name !== previewToRemove.name || file.lastModified !== parseInt(previewId.split('-').pop())));
//         setMediaPreviews(prevPreviews => prevPreviews.filter(p => p.id !== previewId));
//     };

//     const handleSave = async () => {
//         if (!title.trim() || !content.trim()) {
//             setError("Please fill in both topic and content.");
//             return;
//         }
//         setIsLoading(true);
//         setError(null);
//         try {
//             const rawTags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
//             const invalidTags = rawTags.filter(tag => /\s/.test(tag.replace(/^#/, '')));
//             if (invalidTags.length > 0) {
//                 setError(`Invalid hashtag(s): ${invalidTags.join(', ')}. Hashtags must not contain spaces.`);
//                 return;
//             }
//             const tagsArray = rawTags.map(tag => tag.replace(/^#/, ''));


//             const memoryData = { title, content, emotionID: selectedEmotionId, tags: tagsArray, createdAt: selectedDate.toISOString() };
//             const newMemory = await createMemory(memoryData);
//             if (mediaFiles.length > 0) {
//                 await uploadMediaForMemory(newMemory.memoryID, mediaFiles);
//             }
//             navigate("/dashboard");
//         } catch (err) {
//             console.error("Failed to save memory:", err);
//             setError(err.message || 'An error occurred while saving.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const selectedEmotion = emotions.find(e => e.emotionID === selectedEmotionId);

//     return (
//         <AppLayout>
//             <div className="relative w-full mx-auto p-6 mt-6 border rounded-xl shadow bg-white">
//                 <Link to="/dashboard" className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-black transition-all duration-200" aria-label="Close">
//                     <FiX size={24} />
//                 </Link>

//                 <h2 className="text-2xl font-bold text-center mb-6 pt-4">Create Memory</h2>
//                 <div className="flex items-center gap-3 mb-4">
//                     <img src="/src/assets/avt.avif" className="w-10 h-10 rounded-full object-cover" alt="avatar" />
//                     <p className="font-medium">Username</p>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-4 mb-4">
//                     <div className="relative w-fit" ref={emotionDropdownRef}>
//                         <button onClick={() => setIsEmotionDropdownOpen(!isEmotionDropdownOpen)} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors">
//                             {selectedEmotion ? (
//                                 <>
//                                     <span>{selectedEmotion.symbol}</span>
//                                     <span className="font-medium text-sm">{selectedEmotion.name}</span>
//                                 </>
//                             ) : (
//                                 <span className="text-sm text-gray-500">Select Emotion</span>
//                             )}
//                             <FiChevronDown className={`transition-transform duration-300 ${isEmotionDropdownOpen ? 'rotate-180' : ''}`} />
//                         </button>
//                         {isEmotionDropdownOpen && (
//                             <div className="absolute z-20 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border overflow-hidden">
//                                 {emotions.map(e => (
//                                     <div key={e.emotionID} onClick={() => { setSelectedEmotionId(e.emotionID); setIsEmotionDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
//                                         <span>{e.symbol}</span>
//                                         <span>{e.name}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div className="relative w-fit">
//                         <DatePicker
//                             selected={selectedDate}
//                             onChange={(date) => {
//                                 setSelectedDate(date);
//                                 setIsDatePickerOpen(false);
//                             }}
//                             onCalendarOpen={() => setIsDatePickerOpen(true)}
//                             onCalendarClose={() => setIsDatePickerOpen(false)}
//                             customInput={<CustomDateInput isOpen={isDatePickerOpen} />}
//                             dateFormat="dd/MM/yyyy"
//                             popperClassName="new-datepicker-theme-popper"
//                             renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
//                                 <div className="new-datepicker-theme">
//                                     <div className="datepicker-header">
//                                         <button onClick={decreaseMonth} type="button" className="datepicker-nav-button"><PrevIcon /></button>
//                                         <div className="datepicker-select-wrapper">
//                                             <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="datepicker-select">
//                                                 {months.map(option => <option key={option} value={option}>{option}</option>)}
//                                             </select>
//                                             <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)} className="datepicker-select">
//                                                 {years.map(option => <option key={option} value={option}>{option}</option>)}
//                                             </select>
//                                         </div>
//                                         <button onClick={increaseMonth} type="button" className="datepicker-nav-button"><NextIcon /></button>
//                                     </div>
//                                 </div>
//                             )}
//                         />
//                     </div>

//                     <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
//                         <FaTag className="text-gray-500" />
//                         <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="#love, #family" className="bg-transparent focus:outline-none text-sm w-32" />
//                     </div>
//                 </div>

//                 <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What is today's topic?" className="w-full text-xl font-medium border-0 border-b bg-transparent focus:outline-none focus:ring-0 mb-4" />

//                 {mediaPreviews.length > 0 && (
//                     <div className="mb-4 p-4 border rounded-lg bg-gray-50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {mediaPreviews.map(preview => (
//                             <div key={preview.id} className="relative group">
//                                 {preview.type === 'IMAGE' ? (
//                                     <img src={preview.url} alt={preview.name} className="w-full h-24 object-cover rounded" />
//                                 ) : (
//                                     <div className="w-full h-24 flex flex-col items-center justify-center bg-gray-200 rounded p-2 text-center">
//                                         <FaPaperclip className="text-2xl text-gray-500 mb-1" />
//                                         <p className="text-xs text-gray-700 break-all">{preview.name}</p>
//                                     </div>
//                                 )}
//                                 <button onClick={() => handleRemoveFile(preview.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
//                                     ×
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 <textarea rows="8" value={content} onChange={(e) => setContent(e.target.value)} className="w-full text-lg border border-gray-300 rounded p-4 focus:outline-none focus:border-black" placeholder="Write your memory..."></textarea>

//                 <div className="flex items-center gap-x-6 mt-6">
//                     <button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow disabled:bg-gray-400 transition-transform hover:scale-105">
//                         {isLoading ? 'Saving...' : 'Save'}
//                     </button>

//                     <div className="flex gap-4 items-center text-gray-600 text-lg bg-white px-4 py-2 rounded-lg shadow border">
//                         {[FaUndo, FaRedo, FaMapMarkerAlt, FaPaperclip, FaSmile, FaImage, FaItalic, FaBold, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight].map((Icon, index) => (
//                             <button key={index} type="button" onClick={Icon === FaImage || Icon === FaPaperclip ? () => fileInputRef.current?.click() : undefined} className="hover:text-blue-500 transition-transform transform hover:scale-110">
//                                 <Icon />
//                             </button>
//                         ))}
//                         <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
//                     </div>
//                 </div>
//                 {error && <p className="text-red-500 mt-4">{error}</p>}
//             </div>
//         </AppLayout>
//     );
// }
import { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../index.css';
import AppLayout from '../../components/AppLayout';

import {
    FaImage, FaPaperclip, FaSmile, FaBold, FaUnderline, FaItalic,
    FaAlignCenter, FaMapMarkerAlt, FaTag, FaCalendarAlt
} from 'react-icons/fa';
import { FiChevronDown, FiX } from 'react-icons/fi';

import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import Picker from 'emoji-picker-react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

import "react-datepicker/dist/react-datepicker.css";
import '../../components/datePicker.css';
import '../../components/tiptap.css';

import { createMemory, getEmotions, uploadMediaForMemory } from '../../services/api';

const PrevIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
const NextIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

const CustomDateInput = forwardRef(({ value, onClick, isOpen }, ref) => (
    <div onClick={onClick} ref={ref} className="bg-gray-100 w-full min-w-[130px] px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
        <FaCalendarAlt className="text-gray-500" />
        <span className="text-sm text-gray-700 flex-grow">{value || 'Date'}</span>
        <FiChevronDown className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </div>
));

export default function CreateMemory() {
    const [title, setTitle] = useState('');
    const [selectedEmotionId, setSelectedEmotionId] = useState('');
    const [tags, setTags] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEmotionDropdownOpen, setIsEmotionDropdownOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const emotionDropdownRef = useRef(null);
    const navigate = useNavigate();
    const fileImageRef = useRef(null);
    const fileOtherRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        editorProps: {
            attributes: {
                class: 'min-h-[200px] w-full border border-gray-300 rounded p-4 focus:outline-none focus:border-black text-lg tiptap-editor',
            },
        },
        content: '',
    });

    const years = Array.from({ length: getYear(new Date()) - 1989 }, (_, i) => 1990 + i).reverse();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                const data = await getEmotions();
                setEmotions(data);
                if (data.length > 0) setSelectedEmotionId(data[0].emotionID);
            } catch (err) {
                console.error("Failed to fetch emotions", err);
                setError("Could not load emotions.");
            }
        };
        fetchEmotions();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emotionDropdownRef.current && !emotionDropdownRef.current.contains(event.target)) {
                setIsEmotionDropdownOpen(false);
            }
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setIsEmojiPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            mediaPreviews.forEach(preview => {
                if (preview.url) URL.revokeObjectURL(preview.url);
            });
        };
    }, [mediaPreviews]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length > 0) {
            setMediaFiles(prevFiles => [...prevFiles, ...newFiles]);
            const newPreviews = newFiles.map(file => ({
                id: `${file.name}-${file.lastModified}`,
                name: file.name,
                url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                type: file.type.startsWith('image/') ? 'IMAGE' : 'OTHER',
            }));
            setMediaPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };

    const handleRemoveFile = (previewId) => {
        const previewToRemove = mediaPreviews.find(p => p.id === previewId);
        if (!previewToRemove) return;
        if (previewToRemove.url) URL.revokeObjectURL(previewToRemove.url);
        setMediaFiles(prevFiles => prevFiles.filter(file => file.name !== previewToRemove.name || file.lastModified !== parseInt(previewId.split('-').pop())));
        setMediaPreviews(prevPreviews => prevPreviews.filter(p => p.id !== previewId));
    };
    
    const onEmojiClick = (emojiObject) => {
        if (editor) {
            editor.chain().focus().insertContent(emojiObject.emoji).run();
        }
        setIsEmojiPickerOpen(false);
    };

    const handleSave = async () => {
        if (!editor) return;
        const content = editor.getHTML();
        
        if (!title.trim() || editor.isEmpty) {
            setError("Please fill in both topic and content.");
            return;
        }
        if (title.length > 255) {
            setError("Title too long.");
            return;
        }
        const rawTags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
        if (rawTags.length > 10) {
            setError("Maximum 10 tags allowed.");
            return;
        }
        const invalidTags = rawTags.filter(tag => /\s/.test(tag.replace(/^#/, '')));
        if (invalidTags.length > 0) {
            setError(`Invalid hashtag(s): ${invalidTags.join(', ')}. Hashtags must not contain spaces.`);
            return;
        }
        const tagsArray = rawTags.map(tag => tag.replace(/^#/, ''));
        const maxFileSize = 10 * 1024 * 1024;
        const oversizedFiles = mediaFiles.filter(file => file.size > maxFileSize);
        if (oversizedFiles.length > 0) {
            setError(`File "${oversizedFiles[0].name}" is too large. Maximum size allowed is 10MB.`);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const memoryData = { title, content, emotionID: selectedEmotionId, tags: tagsArray, createdAt: selectedDate.toISOString() };
            const newMemory = await createMemory(memoryData);
            if (mediaFiles.length > 0) {
                await uploadMediaForMemory(newMemory.memoryID, mediaFiles);
            }
            navigate("/dashboard");
        } catch (err) {
            console.error("Failed to save memory:", err);
            setError(err.message || 'An error occurred while saving.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAlignCenter = () => {
        if (!editor) return;
        if (editor.isActive({ textAlign: 'center' })) {
            editor.chain().focus().unsetTextAlign().run();
        } else {
            editor.chain().focus().setTextAlign('center').run();
        }
    };

    const selectedEmotion = emotions.find(e => e.emotionID === selectedEmotionId);
    const iconButtonClass = "w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 text-gray-600";

    if (!editor) {
        return null;
    }

    return (
        <AppLayout>
            <div className="relative w-full mx-auto p-6 mt-6 border rounded-xl shadow bg-white">
                <Link to="/dashboard" className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-black transition-all duration-200" aria-label="Close">
                    <FiX size={24} />
                </Link>

                <h2 className="text-2xl font-bold text-center mb-6 pt-4">Create Memory</h2>
                
                <div className="flex items-center gap-3 mb-4">
                    <img src="/src/assets/avt.avif" className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                    <p className="font-medium">Username</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="relative w-fit" ref={emotionDropdownRef}>
                        <button onClick={() => setIsEmotionDropdownOpen(!isEmotionDropdownOpen)} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors">
                            {selectedEmotion ? (
                                <>
                                    <span>{selectedEmotion.symbol}</span>
                                    <span className="font-medium text-sm">{selectedEmotion.name}</span>
                                </>
                            ) : (
                                <span className="text-sm text-gray-500">Select Emotion</span>
                            )}
                            <FiChevronDown className={`transition-transform duration-300 ${isEmotionDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isEmotionDropdownOpen && (
                            <div className="absolute z-20 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border overflow-hidden">
                                {emotions.map(e => (
                                    <div key={e.emotionID} onClick={() => { setSelectedEmotionId(e.emotionID); setIsEmotionDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                        <span>{e.symbol}</span>
                                        <span>{e.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative w-fit">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date);
                                setIsDatePickerOpen(false);
                            }}
                            onCalendarOpen={() => setIsDatePickerOpen(true)}
                            onCalendarClose={() => setIsDatePickerOpen(false)}
                            customInput={<CustomDateInput isOpen={isDatePickerOpen} />}
                            dateFormat="dd/MM/yyyy"
                            popperClassName="new-datepicker-theme-popper"
                            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
                                <div className="new-datepicker-theme">
                                    <div className="datepicker-header">
                                        <button onClick={decreaseMonth} type="button" className="datepicker-nav-button"><PrevIcon /></button>
                                        <div className="datepicker-select-wrapper">
                                            <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="datepicker-select">
                                                {months.map(option => <option key={option} value={option}>{option}</option>)}
                                            </select>
                                            <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)} className="datepicker-select">
                                                {years.map(option => <option key={option} value={option}>{option}</option>)}
                                            </select>
                                        </div>
                                        <button onClick={increaseMonth} type="button" className="datepicker-nav-button"><NextIcon /></button>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
                        <FaTag className="text-gray-500" />
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="#love, #family" className="bg-transparent focus:outline-none text-sm w-32" />
                    </div>
                </div>

                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What is today's topic?" className="w-full text-xl font-medium border-0 border-b bg-transparent focus:outline-none focus:ring-0 mb-4" />

                {mediaPreviews.length > 0 && (
                    <div className="mb-4 p-4 border rounded-lg bg-gray-50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaPreviews.map(preview => (
                            <div key={preview.id} className="relative group">
                                {preview.type === 'IMAGE' ? (
                                    <img src={preview.url} alt={preview.name} className="w-full h-24 object-cover rounded" />
                                ) : (
                                    <div className="w-full h-24 flex flex-col items-center justify-center bg-gray-200 rounded p-2 text-center">
                                        <FaPaperclip className="text-2xl text-gray-500 mb-1" />
                                        <p className="text-xs text-gray-700 break-all">{preview.name}</p>
                                    </div>
                                )}
                                <button onClick={() => handleRemoveFile(preview.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <EditorContent editor={editor} />
                
                <div className="flex items-center gap-x-6 mt-6">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow disabled:bg-gray-400 transition-transform hover:scale-105"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>

                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow border">
                        <button type="button" className={`${iconButtonClass} hover:text-blue-500`}><FaMapMarkerAlt /></button>
                        <button type="button" onClick={() => fileOtherRef.current?.click()} className={`${iconButtonClass} hover:text-blue-500`}><FaPaperclip /></button>
                        
                        <div className="relative" ref={emojiPickerRef}>
                            <button type="button" onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)} className={`${iconButtonClass} hover:text-blue-500`}>
                                <FaSmile />
                            </button>
                            {isEmojiPickerOpen && (
                                <div className="absolute z-30 bottom-full mb-2">
                                    <Picker onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                        </div>

                        <button type="button" onClick={() => fileImageRef.current?.click()} className={`${iconButtonClass} hover:text-blue-500`}><FaImage /></button>
                        <div className="w-px h-5 bg-gray-200 mx-1"></div>

                        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${iconButtonClass} ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>
                            <FaBold />
                        </button>
                        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${iconButtonClass} ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>
                            <FaItalic />
                        </button>
                        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${iconButtonClass} ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>
                            <FaUnderline />
                        </button>
                        <button type="button" onClick={toggleAlignCenter} className={`${iconButtonClass} ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>
                            <FaAlignCenter />
                        </button>
                    </div>

                    <input type="file" accept="image/*" multiple onChange={handleFileChange} ref={fileImageRef} style={{ display: 'none' }} />
                    <input type="file" multiple onChange={handleFileChange} ref={fileOtherRef} style={{ display: 'none' }} />
                </div>

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </AppLayout>
    );
}