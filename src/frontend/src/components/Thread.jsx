import DOMPurify from 'dompurify';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Thread = ({ memory }) => {
  if (!memory || !memory.created_at) {
    return null;
  }

  const displayMedia = Array.isArray(memory.media)
    ? memory.media.find(item => item.type === 'IMAGE' || item.type === 'VIDEO')
    : null;

  const date = new Date(memory.memoryDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const time = new Date(memory.memoryDate).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const tagsString = Array.isArray(memory.memoryTags) 
    ? memory.memoryTags.map(({ tag }) => tag ? `#${tag.name}` : '').join(' ')
    : '';

  const emotionName = memory.emotion?.name || 'No Emotion';
  
  const location = memory.location;

  const cleanContentHTML = DOMPurify.sanitize(memory.content);

  return (
    // THAY ĐỔI 1: NỀN CARD
    <div className="flex flex-col gap-3 p-4 ">

      {/* THAY ĐỔI 2: VĂN BẢN HEADER */}
      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-gray-700 dark:text-gray-400">
        <span>{date}</span>

        {tagsString && (
            <>
                {/* Giữ nguyên màu cho dấu chấm */}
                <span className="text-gray-400 dark:text-gray-600">•</span>
                {/* Giữ nguyên màu xanh cho tag để nổi bật */}
                <span className="text-blue-600 dark:text-blue-400">{tagsString}</span>
            </>
        )}

        <span className="ml-auto">{emotionName}</span>
      </div>

      {/* THAY ĐỔI 3: TIÊU ĐỀ */}
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 -mt-1">{memory.title}</h2>

      {displayMedia && (
        <div className="rounded-lg overflow-hidden my-2">
          {displayMedia.type === 'IMAGE' ? (
            <img src={displayMedia.url} alt={memory.title} className="w-full h-auto object-cover" />
          ) : (
            <video controls src={displayMedia.url} className="w-full h-auto">
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {memory.content && (
        <div className="relative max-h-24 overflow-hidden">
          {/* THAY ĐỔI 4: NỘI DUNG CHÍNH */}
          <div 
            className="text-gray-700 dark:text-gray-300 text-base tiptap-rendered-content"
            dangerouslySetInnerHTML={{ __html: cleanContentHTML }} 
          />
          {/* THAY ĐỔI 5: HIỆU ỨNG MỜ DẦN (FADE) */}
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#F9F9F2] dark:from-gray-800 to-transparent pointer-events-none" />
        </div>
      )}


      {/* THAY ĐỔI 6: VĂN BẢN FOOTER */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
  
        <div className="flex items-center gap-1">
            {location && (
                <>
                    <FaMapMarkerAlt size={11} />
                    <span className="truncate max-w-[150px]">{location}</span>
                </>
            )}
        </div>

     
        <span>{time}</span>
      </div>
    </div>
  );
}; 
export default Thread;


// import DOMPurify from 'dompurify';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const Thread = ({ memory }) => {
//   if (!memory || !memory.created_at) {
//     return null;
//   }

//   const displayMedia = Array.isArray(memory.media)
//     ? memory.media.find(item => item.type === 'IMAGE' || item.type === 'VIDEO')
//     : null;

//   const date = new Date(memory.memoryDate).toLocaleDateString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   });

//   const time = new Date(memory.memoryDate).toLocaleTimeString('vi-VN', {
//     hour: '2-digit',
//     minute: '2-digit',
//   });
  
//   const tagsString = Array.isArray(memory.memoryTags) 
//     ? memory.memoryTags.map(({ tag }) => tag ? `#${tag.name}` : '').join(' ')
//     : '';

//   const emotionName = memory.emotion?.name || 'No Emotion';
  
//   const location = memory.location;

//   const cleanContentHTML = DOMPurify.sanitize(memory.content);

//   return (
//     <div className="flex flex-col gap-3 bg-[#F9F9F2] rounded-2xl p-4 shadow-sm">

//       <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-gray-700">
//         <span>{date}</span>

//         {tagsString && (
//             <>
//                 <span className="text-gray-400">•</span>
//                 <span className="text-blue-600">{tagsString}</span>
//             </>
//         )}

//         <span className="ml-auto">{emotionName}</span>
//       </div>

//       <h2 className="text-lg font-bold text-gray-800 -mt-1">{memory.title}</h2>

//       {displayMedia && (
//         <div className="rounded-lg overflow-hidden my-2">
//           {displayMedia.type === 'IMAGE' ? (
//             <img src={displayMedia.url} alt={memory.title} className="w-full h-auto object-cover" />
//           ) : (
//             <video controls src={displayMedia.url} className="w-full h-auto">
//               Your browser does not support the video tag.
//             </video>
//           )}
//         </div>
//       )}

//       {memory.content && (
//         <div className="relative max-h-24 overflow-hidden">
//           <div 
//             className="text-gray-700 text-base tiptap-rendered-content"
//             dangerouslySetInnerHTML={{ __html: cleanContentHTML }} 
//           />
//           <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#F9F9F2] to-transparent pointer-events-none" />
//         </div>
//       )}


//       <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
  
//         <div className="flex items-center gap-1">
//             {location && (
//                 <>
//                     <FaMapMarkerAlt size={11} />
//                     <span className="truncate max-w-[150px]">{location}</span>
//                 </>
//             )}
//         </div>

     
//         <span>{time}</span>
//       </div>
//     </div>
//   );
// }; 
// export default Thread;