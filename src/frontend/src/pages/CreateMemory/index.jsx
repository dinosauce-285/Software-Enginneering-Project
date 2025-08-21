import { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';

import {
    FaImage, FaSmile, FaBold, FaUnderline, FaItalic, FaAlignCenter,
    FaMapMarkerAlt, FaTag, FaCalendarAlt, FaMusic 
} from 'react-icons/fa';
import { FiChevronDown, FiX } from 'react-icons/fi';

import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import Picker, { Theme as EmojiTheme } from 'emoji-picker-react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useTheme } from '../../contexts/ThemeContext';
import "react-datepicker/dist/react-datepicker.css";
import '../../components/datePicker.css';
import './CreateMemory.css';

import { createMemory, getEmotions, uploadMediaForMemory } from '../../services/api';
import { LocationSearchInput } from '../../components/LocationSearchInput';
import { useAuth } from '../../contexts/AuthContext';

import defaultAvatar from '../../assets/defaultAvt.png';


const PrevIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
const NextIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

const CustomDateChip = forwardRef(({ value, onClick, isOpen }, ref) => (
    <button onClick={onClick} ref={ref} className="flex items-center justify-between w-full gap-2 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 transition-colors">
        <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{value || 'Date'}</span>
        </div>
        <FiChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
));

const InputChip = ({ icon, children }) => (
    <div className="flex items-center w-full gap-2 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400">
        {icon}
        {children}
    </div>
);


export default function CreateMemory() {
    const { user } = useAuth();
    const { theme } = useTheme();
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
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [location, setLocation] = useState('');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const emotionDropdownRef = useRef(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Tell your story...' }),
        ],
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] py-4',
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
            } catch (err) { console.error("Failed to fetch emotions", err); }
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
            // Dọn dẹp các URL object khi component unmount
            mediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [mediaPreviews]);


    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setMediaFiles(prev => [...prev, ...newFiles]);

        const newPreviews = newFiles.map(file => {
            let fileType = 'OTHER';
            if (file.type.startsWith('image/')) {
                fileType = 'IMAGE';
            } else if (file.type.startsWith('video/')) {
                fileType = 'VIDEO';
            } else if (file.type.startsWith('audio/')) {
                fileType = 'AUDIO';
            }

            // Chỉ tạo preview cho các loại file được hỗ trợ
            if (fileType === 'OTHER') {
                return null;
            }

            return {
                id: `${file.name}-${file.lastModified}`,
                name: file.name,
                url: URL.createObjectURL(file),
                type: fileType,
            };
        }).filter(Boolean);

        setMediaPreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveFile = (previewIdToRemove) => {
        const previewToRemove = mediaPreviews.find(p => p.id === previewIdToRemove);
        if (previewToRemove?.url) {
            URL.revokeObjectURL(previewToRemove.url);
        }
        setMediaFiles(prev => prev.filter(f => `${f.name}-${f.lastModified}` !== previewIdToRemove));
        setMediaPreviews(prev => prev.filter(p => p.id !== previewIdToRemove));
    };

    const handleSave = async () => {
        if (!editor || !title.trim() || editor.isEmpty) {
            setError("Title and content are required.");
            return;
        }

        const tagsArray = tags
            .split(',')
            .map(t => t.trim().replace(/^#/, ''))
            .filter(Boolean);

        // Kiểm tra số lượng tag
        if (tagsArray.length > 10) {
            setError("Maximum 10 tags allowed.");
            return;
        }

        // Kiểm tra tag quá dài
        if (tagsArray.some(tag => tag.length > 255)) {
            setError("Tag too long.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const memoryData = {
                title,
                content: editor.getHTML(),
                emotionID: selectedEmotionId,
                tags: tagsArray,
                memoryDate: selectedDate.toISOString(),
                location,
            };
            const newMemory = await createMemory(memoryData);
            if (mediaFiles.length > 0) {
                await uploadMediaForMemory(newMemory.memoryID, mediaFiles);
            }
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || 'An error occurred.');
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
    const iconButtonClass = (isActive) =>
        `p-2 rounded-md transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`;

    return (
        <AppLayout>
            <div className="relative w-full mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg mt-8">
                <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">New Memory</h1>
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Cancel</Link>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-blue-500 text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </header>

                <div className="mt-6">
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src={user.avatar || defaultAvatar}
                            className="w-10 h-10 rounded-full object-cover"
                            alt="avatar"
                        />
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {user ? user.display_name : 'Loading...'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="relative" ref={emotionDropdownRef}>
                            <button onClick={() => setIsEmotionDropdownOpen(o => !o)} className="flex items-center justify-between w-full gap-2 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 transition-colors">
                                <div className="flex items-center gap-2 truncate">
                                    {selectedEmotion ? (
                                        <>
                                            <span className="flex-shrink-0">{selectedEmotion.symbol}</span>
                                            <span className="font-medium truncate">{selectedEmotion.name}</span>
                                        </>
                                    ) : 'Emotion'}
                                </div>
                                <FiChevronDown size={16} className={`flex-shrink-0 transition-transform duration-300 ${isEmotionDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isEmotionDropdownOpen && (
                                <div className="absolute z-20 top-full mt-2 w-full bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600">
                                    {emotions.map(e => (
                                        <div key={e.emotionID} onClick={() => { setSelectedEmotionId(e.emotionID); setIsEmotionDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-800 dark:text-gray-200">
                                            <span>{e.symbol}</span>
                                            <span>{e.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <InputChip icon={<FaTag className="flex-shrink-0" />}>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Add tags"
                                className="bg-transparent focus:outline-none w-full placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </InputChip>

                        <InputChip icon={<FaMapMarkerAlt className="flex-shrink-0" />}>
                            <LocationSearchInput
                                onLocationSelect={setLocation}
                                placeholder="Add location"
                                className="bg-transparent focus:outline-none w-full placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </InputChip>

                        <div className="relative">
                            <DatePicker
                                selected={selectedDate}
                                onChange={setSelectedDate}
                                dateFormat="MMM d, yyyy"
                                onCalendarOpen={() => setIsDatePickerOpen(true)}
                                onCalendarClose={() => setIsDatePickerOpen(false)}
                                customInput={<CustomDateChip isOpen={isDatePickerOpen} />}
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
                    </div>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="An unforgettable title..."
                        className="bg-transparent w-full text-3xl font-extrabold text-gray-900 dark:text-gray-100 border-none focus:outline-none focus:ring-0 mb-2 placeholder-gray-400 dark:placeholder-gray-500"
                    />

                    {mediaPreviews.length > 0 && (
                        <div className="my-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {mediaPreviews.map(p => (
                                <div key={p.id} className="relative group aspect-square dark:bg-gray-700 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-white">
                                    {p.type === 'IMAGE' && (
                                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                                    )}
                                    {p.type === 'VIDEO' && (
                                        <video src={p.url} className="w-full h-full object-cover" controls />
                                    )}
                                    {p.type === 'AUDIO' && (
                                        <div className="flex flex-col items-center justify-center p-2 text-center">
                                            <FaMusic size={40} className="text-gray-500 dark:text-gray-400" />
                                            <p className="text-xs mt-2 text-gray-600 dark:text-gray-300 break-all line-clamp-2">{p.name}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleRemoveFile(p.id)}
                                        className="absolute top-1.5 right-1.5 bg-black bg-opacity-60 text-white rounded-full p-1 leading-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <EditorContent editor={editor} />

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className={iconButtonClass(false)}><FaImage /></button>
                            <div className="relative" ref={emojiPickerRef}>
                                <button type="button" onClick={() => setIsEmojiPickerOpen(o => !o)} className={iconButtonClass(isEmojiPickerOpen)}><FaSmile /></button>
                                {isEmojiPickerOpen && (
                                    <div className="absolute z-20 bottom-full mb-2">
                                        <Picker onEmojiClick={(emoji) => editor.chain().focus().insertContent(emoji.emoji).run()}
                                            theme={theme === 'Dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                                        />

                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={iconButtonClass(editor.isActive('bold'))}><FaBold /></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={iconButtonClass(editor.isActive('italic'))}><FaItalic /></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={iconButtonClass(editor.isActive('underline'))}><FaUnderline /></button>
                            <button type="button" onClick={toggleAlignCenter} className={iconButtonClass(editor.isActive({ textAlign: 'center' }))}><FaAlignCenter /></button>
                        </div>
                    </div>

                    <input
                        type="file"
                        accept="image/*,video/*,audio/*"
                        multiple
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                </div>
                {error && <p className="text-red-500 mt-4 text-center dark:text-red-400 text-sm">{error}</p>}
            </div>
        </AppLayout>
    );
}