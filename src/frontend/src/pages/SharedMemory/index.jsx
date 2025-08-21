import React, { useDeferredValue, useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getSharedMemoryByToken } from '../../services/api';
import DOMPurify from 'dompurify';

import {
    CalendarDaysIcon, MapPinIcon, HashtagIcon, HeartIcon
} from '../../components/Icons';

import defaultAvatar from '../../assets/defaultAvt.png';


const LoadingShare = () => (
    <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Loading shared memory...</p>
    </div>
);

const InvalidLink = () => (
    <div className="flex flex-col items-center justify-center h-screen text-center p-8">
        <h1 className="text-4xl font-bold">Link Invalid or Expired</h1>
        <p className="text-xl mt-2">This share link could not be found or may have expired.</p>
        <RouterLink to="/" className="mt-6 px-5 py-2 bg-black text-white rounded-lg">
            ← Go to Homepage
        </RouterLink>
    </div>
);


export default function SharedMemoryPage() {
    const { token } = useParams();
    const [sharedData, setSharedData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSharedMemory = async () => {
            if (!token) {
                setError("No share token provided.");
                setIsLoading(false);
                return;
            }
            try {
                const data = await getSharedMemoryByToken(token);
                setSharedData(data);
            } catch (err) {
                console.error('Failed to fetch shared memory:', err);
                setError(err.message || 'Could not load shared memory.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSharedMemory();
    }, [token]);


    if (isLoading) return <LoadingShare />;
    if (error || !sharedData) return <InvalidLink />;

    const { memory, author } = sharedData;

    const displayMedia = Array.isArray(memory.media) ? memory.media.find(item => item.type === 'IMAGE' || item.type === 'VIDEO') : null;
    const date = new Date(memory.memoryDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = new Date(memory.memoryDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const tagsString = Array.isArray(memory.memoryTags) ? memory.memoryTags.map(({ tag }) => tag ? `#${tag.name}` : '').join(' ') : '';
    const emotionName = memory.emotion?.name || 'N/A';
    const emotionSymbol = memory.emotion?.symbol || '';
    const cleanContent = DOMPurify.sanitize(memory.content);

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="py-6">
                <div className="max-w-6xl mx-auto bg-[#F9F9F2] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <img
                                src={author.avatar || defaultAvatar}
                                alt={author.display_name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm text-gray-500">A memory by</p>
                                <p className="font-semibold text-gray-800">{author.display_name}</p>
                            </div>
                        </div>
                        <RouterLink to="/" className="text-sm text-gray-500 hover:text-black">
                            Powered by SoulNote
                        </RouterLink>
                    </div>

                    <div className="flex flex-col gap-3 text-lg text-gray-800 mb-8">
                        <div className="flex items-center gap-3 flex-wrap"><CalendarDaysIcon className="w-6 h-6 text-gray-600" /><span>{date}</span><span className="text-gray-400">•</span><span>{time}</span></div>
                        <div className="flex items-center gap-3"><MapPinIcon className="w-6 h-6 text-gray-600" /><span>{memory.location || 'Unknown Location'}</span></div>
                        <div className="flex items-center gap-3"><HeartIcon className="w-6 h-6 text-gray-600" /><span>Emotion: <strong>{emotionName}</strong>{emotionSymbol && <span className="text-2xl ml-1">{emotionSymbol}</span>}</span></div>
                        {tagsString && <div className="flex items-center gap-3"><HashtagIcon className="w-6 h-6 text-gray-600" /><span className="text-blue-600">{tagsString}</span></div>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
                        {displayMedia && (
                            <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-gray-200">
                                {displayMedia.type === 'IMAGE' ? <img src={displayMedia.url} alt={memory.title} className="absolute inset-0 w-full h-full object-cover" /> : <video controls src={displayMedia.url} className="absolute inset-0 w-full h-full object-cover" />}
                            </div>
                        )}
                        <div className={!displayMedia ? "md:col-span-2" : ""}>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{memory.title}</h1>
                        </div>
                    </div>

                    <article className="mt-8 pt-6 border-t border-gray-300">
                        <div className="text-base md:text-lg text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanContent }} />
                    </article>

                    {memory.media && memory.media.length > 0 && (
                        <section className="mt-10 pt-6 border-t border-gray-300">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Media Gallery</h3>
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                                {memory.media.map((item) => (
                                    <div key={item.mediaID} className="w-full mb-6 break-inside-avoid">
                                        {item.type === 'IMAGE' && <img src={item.url} alt={`Media for ${memory.title}`} className="w-full h-auto object-cover rounded-lg shadow-sm border" />}
                                        {item.type === 'VIDEO' && <video controls src={item.url} className="w-full h-auto rounded-lg shadow-sm border" />}
                                        {item.type === 'AUDIO' && <div className="p-4 bg-white rounded-lg border shadow-sm"><audio controls src={item.url} className="w-full" /></div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}