// // src/components/Thread.jsx

// import React from 'react';

// export default function Thread({ memory }) {

//   // --- Logic xử lý dữ liệu ---

//   // 1. Tìm media đầu tiên là IMAGE hoặc VIDEO để hiển thị
//   const displayMedia = memory.media.find(
//     item => item.type === 'IMAGE' || item.type === 'VIDEO'
//   );

//   // 2. Định dạng ngày, giờ, và tags
//   const date = new Date(memory.createdAt).toLocaleDateString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric'
//   });

//   const time = new Date(memory.createdAt).toLocaleTimeString('vi-VN', {
//     hour: '2-digit',
//     minute: '2-digit'
//   });
  
//   const tagsString = memory.tags?.map(tag => `#${tag.name}`).join(' ') || '';

//   // --- Render Component ---

//   return (
//     // Card chính với màu nền và bo góc
//     <div className="flex flex-col gap-3 bg-[#F9F9F2] rounded-2xl p-4 shadow-sm">
      
//       {/* 1. Header */}
//       <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-gray-700">
//         <span>{date}</span>
//         <span className="text-gray-400">•</span>
//         <span>{memory.location}</span>
//         <span className="text-gray-400">•</span>
//         <span className="text-blue-600">{tagsString}</span>
//         <span className="ml-auto">{memory.emotion.name}</span>
//       </div>

//       {/* 2. title*/}
//       <h2 className="text-lg font-bold text-gray-800 -mt-1">
//         {memory.title}
//       </h2>

//       {/* 3. Media showing */}
//       {displayMedia && (
//         <div className="rounded-lg overflow-hidden">
//           {displayMedia.type === 'IMAGE' ? (
//             <img
//               src={displayMedia.url}
//               alt={memory.title}
//               className="w-full h-auto object-cover"
//             />
//           ) : (
//             <video
//               controls
//               src={displayMedia.url}
//               className="w-full h-auto"
//             >
//               Your browser does not support the video tag.
//             </video>
//           )}
//         </div>
//       )}

//       {/* 4.Content */}
//       <div className="relative max-h-24 overflow-hidden">
//         <p className="text-gray-700 text-base">
//           {memory.content}
//         </p>
//         {/* Gradient overlay */}
//         <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#F9F9F2] to-transparent pointer-events-none" />
//       </div>

//       {/* 5. time create */}
//       <div className="text-right text-xs text-gray-500 mt-1">
//         <span>{time}</span>
//       </div>
//     </div>
//   );
// }

// src/components/Thread.jsx
import React from 'react';

// Sử dụng export thông thường thay vì export default để tránh lỗi HMR của Vite
export const Thread = ({ memory }) => {
  // Guard Clause mạnh mẽ hơn: kiểm tra memory và memory.created_at
  if (!memory || !memory.created_at) {
    return null;
  }

  // --- Logic xử lý dữ liệu (Cực kỳ an toàn) ---

  // 1. Kiểm tra memory.media có phải là một mảng không trước khi gọi .find()
  const displayMedia = Array.isArray(memory.media)
    ? memory.media.find(item => item.type === 'IMAGE' || item.type === 'VIDEO')
    : null;

  // 2. Định dạng ngày, giờ
  const date = new Date(memory.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const time = new Date(memory.created_at).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // 3. Xử lý tags một cách an toàn
  const tagsString = Array.isArray(memory.memoryTags) 
    ? memory.memoryTags.map(({ tag }) => tag ? `#${tag.name}` : '').join(' ')
    : '';

  // 4. Lấy tên emotion một cách an toàn
  const emotionName = memory.emotion?.name || 'No Emotion';
  
  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-gray-700">
        <span>{date}</span>
        {tagsString && <span className="text-gray-400">•</span>}
        {tagsString && <span className="text-blue-600">{tagsString}</span>}
        <span className="ml-auto">{emotionName}</span>
      </div>

      <h2 className="text-lg font-bold text-gray-800 -mt-1">{memory.title}</h2>

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
        <p className="text-gray-600 text-sm">{memory.content}</p>
      )}

      <div className="text-right text-xs text-gray-500 mt-auto pt-2">
        <span>{time}</span>
      </div>
    </div>
  );
}