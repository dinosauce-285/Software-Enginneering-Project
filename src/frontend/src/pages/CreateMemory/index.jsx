// import { useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../../index.css';
// import AppLayout from '../../components/AppLayout';

// import {
//     FaSmile, FaImage, FaBold, FaUnderline, FaItalic,
//     FaAlignLeft, FaAlignCenter, FaAlignRight,
//     FaRedo, FaUndo, FaMapMarkerAlt, FaReply, FaTag,
//     FaPaperclip, FaCalendarAlt
// } from 'react-icons/fa';

// import { FiChevronDown } from 'react-icons/fi';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { saveMemory } from '../../data/memoryService';

// export default function CreateMemory() {
//     const [topic, setTopic] = useState('');
//     const [content, setContent] = useState('');
//     const [image, setImage] = useState(null);
//     const [emotion, setEmotion] = useState('Happy');
//     const [hashtag, setHashtag] = useState('');
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const fileInputRef = useRef(null);
//     const navigate = useNavigate();

//     const handleImageClick = () => fileInputRef.current?.click();

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImage(reader.result); // lưu base64 string
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSave = () => {
//         if (!topic.trim() || !content.trim()) {
//             alert("Please fill in both topic and content before saving.");
//             return;
//         }

//         const newMemory = {
//             id: Date.now(),
//             title: topic,
//             content,
//             emotion: { icon: "😊", name: emotion },
//             media: image ? [{ type: "IMAGE", url: image }] : [],
//             location: "Vietnam",
//             tags: [{ name: hashtag.replace("#", "") }],
//             createdAt: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
//         };

//         saveMemory(newMemory);
//         console.log("Saved memory:", newMemory);
//         navigate("/dashboard");
//     };




//     return (
//         <AppLayout>
//             <div className="w-full max-w-[1100px] mx-auto p-6 mt-6 border rounded-xl shadow bg-white bg-[#F9F9F2]">
//                 {/* Back button */}
//                 <div className="flex justify-end mb-2">
//                     <Link to="/dashboard" className="text-gray-600 hover:text-black">
//                         <FaReply size={20} />
//                     </Link>
//                 </div>

//                 {/* Header */}
//                 <h2 className="text-2xl font-bold text-center mb-6">Create Memory</h2>

//                 {/* User Info */}
//                 <div className="flex items-center gap-3 mb-4">
//                     <img src="/src/assets/avt.avif" className="w-10 h-10 rounded-full object-cover" alt="avatar" />
//                     <p className="font-medium">Username</p>
//                 </div>

//                 {/* Tags */}
//                 <div className="flex flex-wrap gap-4 mb-4">
//                     {/* Emotion */}
//                     <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded shadow">
//                         <FaSmile className="text-gray-500" />
//                         <select
//                             value={emotion}
//                             onChange={(e) => setEmotion(e.target.value)}
//                             className="bg-gray-100 focus:outline-none cursor-pointer"
//                         >
//                             <option>Happy  😊</option>
//                             <option>Sad    😢</option>
//                             <option>Angry  😠</option>
//                             <option>Calm   😌</option>
//                             <option>Excited 🤩</option>
//                             <option>Anxious 😰</option>
//                             <option>Loved   ❤️</option>
//                             <option>Tired   😴</option>
//                             <option>Confident 😎</option>
//                             <option>Nostalgic 🕰️</option>
//                         </select>
//                     </div>

//                     {/* Date */}
//                     <div className="relative w-fit">
//                         <div
//                             onClick={() => setShowDatePicker(!showDatePicker)}
//                             className="bg-gray-100 min-w-[120px] px-4 py-2 rounded shadow flex items-center gap-2 cursor-pointer"
//                         >
//                             <FaCalendarAlt className="text-gray-500" />
//                             <span className="text-sm text-gray-700">
//                                 {selectedDate ? selectedDate.toLocaleDateString() : 'Date'}
//                             </span>
//                             <FiChevronDown className="text-gray-500" />
//                         </div>

//                         {showDatePicker && (
//                             <div className="absolute z-50 mt-2">
//                                 <DatePicker
//                                     selected={selectedDate}
//                                     onChange={(date) => {
//                                         setSelectedDate(date);
//                                         setShowDatePicker(false);
//                                     }}
//                                     inline
//                                     calendarClassName="!rounded-xl !border !shadow"
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     {/* Hashtag */}
//                     <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded shadow">
//                         <FaTag className="text-gray-500" />
//                         <input
//                             type="text"
//                             value={hashtag}
//                             onChange={(e) => setHashtag(e.target.value)}
//                             placeholder="#hashtag"
//                             className="bg-gray-100 focus:outline-none cursor-text text-sm w-32"
//                         />
//                     </div>
//                 </div>

//                 {/* Topic */}
//                 <input
//                     type="text"
//                     value={topic}
//                     onChange={(e) => setTopic(e.target.value)}
//                     placeholder="What is today's topic?"
//                     className="w-full text-xl font-medium text-gray-900 placeholder-gray-400 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black focus:placeholder-transparent transition mb-4"
//                 />

//                 {/* Preview Image */}
//                 {image && <img src={image} alt="preview" className="mb-4 rounded-lg" />}

//                 {/* Content */}
//                 <textarea
//                     rows="8"
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     className="w-full h-64 text-lg text-gray-900 bg-transparent border border-gray-300 rounded p-4 focus:outline-none focus:border-black placeholder-gray-400"
//                     placeholder="Write your memory..."
//                 ></textarea>

//                 {/* Save + Toolbar */}
//                 <div className="flex items-center gap-x-6 mt-6">
//                     {/* Save Button */}
//                     <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow">
//                         Save
//                     </button>

//                     {/* Toolbar */}
//                     <div className="flex gap-4 items-center text-gray-600 text-lg bg-white px-4 py-2 rounded shadow border">
//                         <button type="button" className="hover:text-blue-500 transition"><FaUndo /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaRedo /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaMapMarkerAlt /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaPaperclip /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaSmile /></button>

//                         <button
//                             type="button"
//                             onClick={handleImageClick}
//                             className="hover:text-blue-500 transition"
//                         >
//                             <FaImage />
//                         </button>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             ref={fileInputRef}
//                             style={{ display: 'none' }}
//                         />

//                         <button type="button" className="hover:text-blue-500 transition"><FaItalic /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaBold /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaUnderline /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaAlignLeft /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaAlignCenter /></button>
//                         <button type="button" className="hover:text-blue-500 transition"><FaAlignRight /></button>
//                     </div>

//                 </div>
//             </div>
//         </AppLayout>
//     );
// }

// src/frontend/pages/CreateMemory/index.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../index.css';
import AppLayout from '../../components/AppLayout';

// Importer toutes les icônes nécessaires
import {
    FaSmile, FaImage, FaBold, FaUnderline, FaItalic,
    FaAlignLeft, FaAlignCenter, FaAlignRight,
    FaRedo, FaUndo, FaMapMarkerAlt, FaReply, FaTag,
    FaPaperclip, FaCalendarAlt
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { createMemory, getEmotions, uploadMediaForMemory } from '../../services/api';

export default function CreateMemory() {
    // États pour les données du formulaire
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedEmotionId, setSelectedEmotionId] = useState('');
    const [tags, setTags] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // États pour le téléchargement de fichiers
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);

    // États de gestion
    const [emotions, setEmotions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Deux références distinctes pour les deux boutons de téléchargement
    const imageInputRef = useRef(null);
    const documentInputRef = useRef(null);
    const navigate = useNavigate();

    // Obtenir la liste des émotions depuis le backend
    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                const data = await getEmotions();
                setEmotions(data);
                if (data.length > 0) {
                    setSelectedEmotionId(data[0].emotionID);
                }
            } catch (err) {
                console.error("Failed to fetch emotions", err);
                setError("Could not load emotions.");
            }
        };
        fetchEmotions();
    }, []);

    // Gérer le changement de fichier
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            if (file.type.startsWith('image/')) {
                setMediaType('IMAGE');
                setMediaPreview(URL.createObjectURL(file));
            } else {
                setMediaType('OTHER');
                setMediaPreview(file.name);
            }
        }
    };
    
    // Gérer la sauvegarde
    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            setError("Please fill in both topic and content.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const memoryData = {
                title,
                content,
                emotionID: selectedEmotionId,
                tags: tagsArray,
            };
            const newMemory = await createMemory(memoryData);
            if (mediaFile) {
                await uploadMediaForMemory(newMemory.memoryID, mediaFile);
            }
            navigate("/dashboard");
        } catch (err) {
            console.error("Failed to save memory:", err);
            setError(err.message || 'An error occurred while saving.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="w-full max-w-[1100px] mx-auto p-6 mt-6 border rounded-xl shadow bg-white">
                <div className="flex justify-end mb-2">
                    <Link to="/dashboard" className="text-gray-600 hover:text-black">
                        <FaReply size={20} />
                    </Link>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Create Memory</h2>
                <div className="flex items-center gap-3 mb-4">
                    <img src="/src/assets/avt.avif" className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                    <p className="font-medium">Username</p>
                </div>
                
                {/* Section des Tags et Options */}
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded shadow">
                        <select
                            value={selectedEmotionId}
                            onChange={(e) => setSelectedEmotionId(e.target.value)}
                            className="bg-transparent focus:outline-none cursor-pointer"
                        >
                            {emotions.map(e => <option key={e.emotionID} value={e.emotionID}>{e.symbol} {e.name}</option>)}
                        </select>
                    </div>
                    <div className="relative w-fit">
                        <div onClick={() => setShowDatePicker(!showDatePicker)} className="bg-gray-100 min-w-[120px] px-4 py-2 rounded shadow flex items-center gap-2 cursor-pointer">
                            <FaCalendarAlt className="text-gray-500" />
                            <span className="text-sm text-gray-700">{selectedDate ? selectedDate.toLocaleDateString() : 'Date'}</span>
                            <FiChevronDown className="text-gray-500" />
                        </div>
                        {showDatePicker && (
                            <div className="absolute z-50 mt-2"><DatePicker selected={selectedDate} onChange={(date) => {setSelectedDate(date); setShowDatePicker(false);}} inline /></div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded shadow">
                        <FaTag className="text-gray-500" />
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="#tinhyeu, #giadinh" className="bg-transparent focus:outline-none text-sm w-32"/>
                    </div>
                </div>

                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What is today's topic?" className="w-full text-xl font-medium border-0 border-b bg-transparent focus:outline-none focus:ring-0 mb-4"/>
                
                {mediaPreview && (
                    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        {mediaType === 'IMAGE' ? <img src={mediaPreview} alt="preview" className="max-h-96 object-contain mx-auto rounded" /> : <p className="text-gray-700">File attached: <strong>{mediaPreview}</strong></p>}
                        <button onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaType(null); }} className="text-red-500 text-sm mt-2">Remove</button>
                    </div>
                )}

                <textarea rows="8" value={content} onChange={(e) => setContent(e.target.value)} className="w-full text-lg border border-gray-300 rounded p-4 focus:outline-none focus:border-black" placeholder="Write your memory..."></textarea>
                
                {/* Barre d'outils et bouton Sauvegarder */}
                <div className="flex items-center gap-x-6 mt-6">
                    <button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow disabled:bg-gray-400">
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    
                    {/* === BARRE D'OUTILS COMPLÈTE RESTAURÉE === */}
                    <div className="flex gap-4 items-center text-gray-600 text-lg bg-white px-4 py-2 rounded shadow border">
                        <button type="button" className="hover:text-blue-500 transition"><FaUndo /></button>
                        <button type="button" className="hover:text-blue-500 transition"><FaRedo /></button>
                        <button type="button" className="hover:text-blue-500 transition"><FaMapMarkerAlt /></button>
                        
                        <button type="button" onClick={() => documentInputRef.current?.click()} className="hover:text-blue-500 transition"><FaPaperclip /></button>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} ref={documentInputRef} style={{ display: 'none' }} />

                        <button type="button" className="hover:text-blue-500 transition"><FaSmile /></button>

                        <button type="button" onClick={() => imageInputRef.current?.click()} className="hover:text-blue-500 transition"><FaImage /></button>
                        <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} ref={imageInputRef} style={{ display: 'none' }} />

                        <button type="button" className="hover:text-blue-500 transition"><FaItalic /></button>
                        <button type="button" className="hover:text-blue-500 transition"><FaBold /></button>
                        <button type="button" className="hover:text-blue-500 transition"><FaUnderline /></button>
                        <button type="button" className="hover:text-blue-500 transition"><FaAlignLeft /></button>
                        <button type="button" className="hover:text-blue-500 transition"><FaAlignCenter /></button>
                        <button type="button" className="hover:text-blue-500 transition"><FaAlignRight /></button>
                    </div>
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </AppLayout>
    );
}
