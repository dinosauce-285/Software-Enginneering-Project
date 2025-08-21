import { useState, useEffect, useRef } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppLayout from '../../components/AppLayout';
import { getMemoryById, deleteMemoryById } from '../../services/api';
import {
  CalendarDaysIcon, MapPinIcon, HashtagIcon, ArrowLeftIcon, HeartIcon,
  EllipsisHorizontalIcon, PencilIcon, ShareIcon, TrashIcon
} from '../../components/Icons';
import DeleteDialog from '../DeleteDialog';
import DOMPurify from 'dompurify';

import ShareDialog from '../../components/ShareDialog';
import { createShareLink } from '../../services/api';

const LoadingDetail = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-xl text-gray-500 dark:text-gray-400">Loading memory...</p>
  </div>
);

export default function MemoryDetail() {
  const { memoryId } = useParams();
  const navigate = useNavigate();

  const [memory, setMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchMemory = async () => {
      if (!memoryId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMemoryById(memoryId);
        setMemory(data);
      } catch (err) {
        console.error('Failed to fetch memory detail:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemory();
  }, [memoryId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleDeleteConfirmed = async () => {
    try {
      await deleteMemoryById(memoryId);
      toast.success('Memory deleted successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete memory:', err);
      toast.error(err.message || 'Could not delete memory. Please try again.');
    }
  };

  const handleCreateShareLink = async (options) => {
    setIsCreatingLink(true);
    try {
      const linkData = await createShareLink(memoryId, options);
      setShareLink(linkData.fullUrl);
    } catch (error) {
      alert('Could not create share link.');
      setShowShareDialog(false);
    } finally {
      setIsCreatingLink(false);
    }
  };

  const openShareDialog = () => {
    setShareLink('');
    setShowShareDialog(true);
  }

  if (isLoading) return <AppLayout><LoadingDetail /></AppLayout>;

  if (error || !memory) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-800 dark:text-gray-200">
          <h1 className="text-4xl font-bold">404 - Not Found</h1>
          <p className="text-xl mt-2">This memory could not be found or you don't have permission to view it.</p>
          <RouterLink to="/dashboard" className="mt-6 px-5 py-2 bg-black text-white rounded-lg cursor-pointer dark:bg-gray-200 dark:text-gray-900 font-semibold">
            ← Back to Dashboard
          </RouterLink>
        </div>
      </AppLayout>
    );
  }

  const displayMedia = Array.isArray(memory.media) ? memory.media.find(item => item.type === 'IMAGE' || item.type === 'VIDEO') : null;
  const date = new Date(memory.memoryDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = new Date(memory.memoryDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const tagsString = Array.isArray(memory.memoryTags) ? memory.memoryTags.map(({ tag }) => tag ? `#${tag.name}` : '').join(' ') : '';
  const emotionName = memory.emotion?.name || 'N/A';
  const emotionSymbol = memory.emotion?.symbol || '';
  const cleanContent = DOMPurify.sanitize(memory.content);

  return (
    <AppLayout>
      <main className="py-6">
        <div className="w-full bg-[#F9F9F2] dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col gap-3 text-lg text-gray-800 dark:text-gray-300">
              <div className="flex items-center gap-3 flex-wrap">
                <CalendarDaysIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span>{date}</span><span className="text-gray-400 dark:text-gray-600">•</span><span>{time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span>{memory.location || 'Unknown Location'}</span>
              </div>
              <div className="flex items-center gap-3">
                <HeartIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span>Emotion: <strong>{emotionName}</strong>{emotionSymbol && <span className="text-2xl ml-1">{emotionSymbol}</span>}</span>
              </div>
              {tagsString && <div className="flex items-center gap-3">
                <HashtagIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="text-blue-600 dark:text-blue-400">{tagsString}</span>
              </div>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RouterLink to="/dashboard" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </RouterLink>
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <EllipsisHorizontalIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-600 z-10">
                    <RouterLink
                      to={`/memory/${memoryId}/edit`}
                      className="flex items-center gap-3 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <PencilIcon className="w-5 h-5" />
                      <span>Edit</span>
                    </RouterLink>
                    <button
                      onClick={openShareDialog}
                      className="flex items-center gap-3 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <ShareIcon className="w-5 h-5" />
                      <span>Share</span>
                    </button>

                    <button onClick={() => setShowDeleteDialog(true)} className="flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                      <TrashIcon className="w-5 h-5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Grid: Media & Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
            {displayMedia && (
              <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                {displayMedia.type === 'IMAGE'
                  ? <img src={displayMedia.url} alt={memory.title} className="absolute inset-0 w-full h-full object-cover" />
                  : <video controls src={displayMedia.url} className="absolute inset-0 w-full h-full object-cover" />}
              </div>
            )}
            <div className={!displayMedia ? "md:col-span-2" : ""}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 leading-tight">{memory.title}</h1>
            </div>
          </div>

          {/* Content */}
          <article className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700 tiptap-rendered-content">
            <div
              className="text-base md:text-lg text-gray-800 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </article>

          {/* Gallery */}
          {memory.media && memory.media.length > 0 && (
            <section className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Media Gallery</h3>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {memory.media.map((item) => (
                  <div
                    key={item.mediaID}
                    className="w-full mb-6 break-inside-avoid cursor-pointer transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-105"
                  >
                    {item.type === 'IMAGE' && (<img src={item.url} alt={`Media for ${memory.title}`} className="w-full h-auto object-cover rounded-lg shadow-sm border dark:border-gray-700" />)}
                    {item.type === 'VIDEO' && (<video controls src={item.url} className="w-full h-auto rounded-lg shadow-sm border dark:border-gray-700">Your browser does not support the video tag.</video>)}
                    {item.type === 'AUDIO' && (<div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm"><audio controls src={item.url} className="w-full">Your browser does not support the audio element.</audio></div>)}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <RouterLink to="/dashboard" className="text-lg text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline transition-colors cursor-pointer">
            ← Back to all memories
          </RouterLink>
        </div>
      </main>

      {/* Dialogs */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onConfirm={handleCreateShareLink}
        shareUrl={shareLink}
        isLoading={isCreatingLink}
      />
      <DeleteDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDeleteConfirmed} />
    </AppLayout>
  );
}