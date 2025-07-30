import { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';

import {
    FaImage, FaSmile, FaBold, FaUnderline, FaItalic, FaAlignCenter,
    FaMapMarkerAlt, FaTag, FaCalendarAlt
} from 'react-icons/fa';
import { FiChevronDown, FiX } from 'react-icons/fi';

import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import Picker from 'emoji-picker-react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

import "react-datepicker/dist/react-datepicker.css";
import '../../components/datePicker.css'; 
import './CreateMemory.css'; 

import { getMemoryById, updateMemory, getEmotions, uploadMediaForMemory, deleteMediaById } from '../../services/api';
import { LocationSearchInput } from '../../components/LocationSearchInput';

// 1. IMPORT HOOK `useAuth`
import { useAuth } from '../../contexts/AuthContext';

// --- HELPER COMPONENTS ---

const PrevIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
const NextIcon = () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

const CustomDateChip = forwardRef(({ value, onClick, isOpen }, ref) => (
    <button onClick={onClick} ref={ref} className="flex items-center justify-between w-full gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-gray-500 transition-colors">
        <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{value || 'Date'}</span>
        </div>
        <FiChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
));

const InputChip = ({ icon, children }) => (
    <div className="flex items-center w-full gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-gray-500 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        {icon}
        {children}
    </div>
);


export default function EditMemory() {
    const { memoryId } = useParams();
    // 2. GỌI HOOK `useAuth` ĐỂ LẤY THÔNG TIN USER
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [selectedEmotionId, setSelectedEmotionId] = useState('');
    const [tags, setTags] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEmotionDropdownOpen, setIsEmotionDropdownOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [location, setLocation] = useState('');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    //const [mediaFiles, setMediaFiles] = useState([]);
    const [existingMedia, setExistingMedia] = useState([]); // Lưu media đã có từ DB
    const [newMediaFiles, setNewMediaFiles] = useState([]); // Lưu các file mới chờ upload
    const [mediaToDelete, setMediaToDelete] = useState([]); // Lưu ID của các media cần xóa

    const emotionDropdownRef = useRef(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Tell your story...' }),
        ],
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none min-h-[200px] py-4',
            },
        },
        content: '',
    });

    const years = Array.from({ length: getYear(new Date()) - 1989 }, (_, i) => 1990 + i).reverse();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        // Hủy bỏ các URL object cũ để tránh rò rỉ bộ nhớ khi component bị unmount
        return () => {
            newMediaFiles.forEach(file => URL.revokeObjectURL(file.previewUrl));
        };
    }, [newMediaFiles]);

    useEffect(() => {
        const fetchMemoryData = async () => {
            try {
                // Fetch song song emotions và memory detail
                const [emotionsData, memoryData] = await Promise.all([
                    getEmotions(),
                    getMemoryById(memoryId),
                ]);

                // Set emotions
                setEmotions(emotionsData);
                
                // Điền dữ liệu memory vào form
                setTitle(memoryData.title);
                if (editor) editor.commands.setContent(memoryData.content);
                setSelectedEmotionId(memoryData.emotionID);
                setTags(memoryData.memoryTags.map(({ tag }) => tag.name).join(', '));
                setSelectedDate(new Date(memoryData.created_at));
                setLocation(memoryData.location || '');
                setExistingMedia(memoryData.media || []);

            } catch (err) {
                console.error("Failed to load data for editing:", err);
                setError("Could not load memory data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemoryData();
    }, [memoryId, editor]);


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
            mediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [mediaPreviews]);


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Thêm một thuộc tính previewUrl tạm thời vào mỗi file object
        files.forEach(file => file.previewUrl = URL.createObjectURL(file));
        setNewMediaFiles(prev => [...prev, ...files]);
    };

    const handleRemoveNewFile = (fileToRemove) => {
        URL.revokeObjectURL(fileToRemove.previewUrl); // Dọn dẹp bộ nhớ
        setNewMediaFiles(prev => prev.filter(file => file !== fileToRemove));
    };

    const handleMarkForDeletion = (mediaId) => {
        // Ẩn media đó khỏi UI
        setExistingMedia(prev => prev.filter(media => media.mediaID !== mediaId));
        // Thêm ID vào danh sách chờ xóa
        setMediaToDelete(prev => [...prev, mediaId]);
    };
    
    const handleSave = async () => {
        if (!editor || !title.trim() || editor.isEmpty) {
            setError("Title and content are required.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            // Dùng DTO của backend (UpdateMemoryDto)
            const memoryDataToUpdate = {
                title,
                content: editor.getHTML(),
                emotionID: selectedEmotionId,
                tags: tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
                // createdAt không cần gửi khi update
                location,
            };

            await Promise.all([
                // 1. Cập nhật text
                updateMemory(memoryId, memoryDataToUpdate),
                // 2. Xóa media
                ...mediaToDelete.map(id => deleteMediaById(id)),
                // 3. Upload media mới (chỉ chạy nếu có file mới)
                newMediaFiles.length > 0 ? uploadMediaForMemory(memoryId, newMediaFiles) : Promise.resolve(),
            ]);
            
            // Tạm thời chưa xử lý upload/delete media khi edit
            
            navigate(`/memory/${memoryId}`); // Quay lại trang detail sau khi save
        } catch (err) {
            setError(err.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <AppLayout><div>Loading for edit...</div></AppLayout>;
    }
    
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
        `p-2 rounded-md transition-colors ${
            isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
        }`;

    return (
        <AppLayout>
            <div className="relative w-full mx-auto bg-white p-8 rounded-lg mt-8">
                <header className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Edit Memory</h1>
                    <div className="flex items-center gap-4">
                        <Link to={`/memory/${memoryId}`} className="text-sm text-gray-600 hover:text-gray-900">Cancel</Link>
                         <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-blue-500 text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </header>

                <div className="mt-6">
                     <div className="flex items-center gap-3 mb-6">
                        <img 
                            src={user?.avatarUrl || "/src/assets/avt.avif"}
                            className="w-10 h-10 rounded-full object-cover" 
                            alt="avatar" 
                        />
                        {/* 3. HIỂN THỊ USERNAME ĐỘNG */}
                        <p className="font-semibold text-gray-800">
                            {user ? user.display_name : 'Loading...'}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="relative" ref={emotionDropdownRef}>
                            <button onClick={() => setIsEmotionDropdownOpen(o => !o)} className="flex items-center justify-between w-full gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-gray-500 transition-colors">
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
                                <div className="absolute z-20 top-full mt-2 w-full bg-white rounded-lg shadow-xl border">
                                    {emotions.map(e => (
                                        <div key={e.emotionID} onClick={() => { setSelectedEmotionId(e.emotionID); setIsEmotionDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                            <span>{e.symbol}</span>
                                            <span>{e.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <InputChip icon={<FaTag className="flex-shrink-0"/>}>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Add tags"
                                className="bg-transparent focus:outline-none w-full"
                            />
                        </InputChip>

                        <InputChip icon={<FaMapMarkerAlt className="flex-shrink-0"/>}>
                            <LocationSearchInput
                                initialValue={location}
                                onLocationSelect={setLocation}
                                placeholder="Add location"
                                className="bg-transparent focus:outline-none w-full"
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
                        className="w-full text-3xl font-extrabold text-gray-900 border-none focus:outline-none focus:ring-0 mb-2"
                    />

                    {/* === THAY ĐỔI 5: Hiển thị cả media cũ và media mới === */}
                    {(existingMedia.length > 0 || newMediaFiles.length > 0) && (
                        <div className="my-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Media</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {/* Hiển thị media đã có */}
                                {existingMedia.map(media => (
                                    <div key={media.mediaID} className="relative group aspect-square">
                                        <img src={media.url} alt="existing media" className="w-full h-full object-cover rounded-lg bg-gray-100"/>
                                        <button onClick={() => handleMarkForDeletion(media.mediaID)} className="absolute top-1.5 right-1.5 bg-black bg-opacity-50 text-white rounded-full p-1 leading-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiX size={14}/>
                                        </button>
                                    </div>
                                ))}
                                {/* Hiển thị preview của các file mới */}
                                {newMediaFiles.map((file, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img src={file.previewUrl} alt="new file preview" className="w-full h-full object-cover rounded-lg bg-gray-100"/>
                                        <button onClick={() => handleRemoveNewFile(file)} className="absolute top-1.5 right-1.5 bg-black bg-opacity-50 text-white rounded-full p-1 leading-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiX size={14}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <EditorContent editor={editor} />
                    
                    <div className="flex items-center justify-between border-t border-gray-200 mt-4 pt-4">
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className={iconButtonClass(false)}><FaImage/></button>
                            <div className="relative" ref={emojiPickerRef}>
                                <button type="button" onClick={() => setIsEmojiPickerOpen(o => !o)} className={iconButtonClass(isEmojiPickerOpen)}><FaSmile/></button>
                                {isEmojiPickerOpen && (
                                    <div className="absolute z-20 bottom-full mb-2">
                                        <Picker onEmojiClick={(emoji) => editor.chain().focus().insertContent(emoji.emoji).run()} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={iconButtonClass(editor.isActive('bold'))}><FaBold/></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={iconButtonClass(editor.isActive('italic'))}><FaItalic/></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={iconButtonClass(editor.isActive('underline'))}><FaUnderline/></button>
                            <button type="button" onClick={toggleAlignCenter} className={iconButtonClass(editor.isActive({ textAlign: 'center' }))}><FaAlignCenter/></button>
                        </div>
                    </div>
                    
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                </div>
                {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}
            </div>
        </AppLayout>
    );
}