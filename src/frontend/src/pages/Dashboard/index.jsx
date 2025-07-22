// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import '../../index.css';
// import AppLayout from '../../components/AppLayout';
// import Thread from '../../components/Thread';
// import sampleMemories from '../../data/sampleMemories.js'; 
// import { loadMemories } from '../../data/memoryService.js';

// export default function Dashboard() {
//     const [memories, setMemories] = useState([]);

//     useEffect(() => {
//         const storedMemories = loadMemories(); 
//         const allMemories = [...sampleMemories, ...storedMemories]; 
//         setMemories(allMemories);
//     }, []);

//     return (
//         <AppLayout>
//             <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
//                 {memories.map((memory) => (
//                     <Link
//                         key={memory.id}
//                         to={`/memory/${memory.id}`}
//                         className="block break-inside-avoid mb-4 transition duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-100 rounded-lg"
//                     >
//                         <Thread memory={memory} />
//                     </Link>
//                 ))}
//             </div>
//         </AppLayout>
//     );
// }

// // src/frontend/pages/Dashboard/index.jsx
// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../../index.css';
// import AppLayout from '../../components/AppLayout';
// import Thread from '../../components/Thread';
// import { getMyMemories } from '../../services/api'; // Sử dụng API thật

// export default function Dashboard() {
//     const [memories, setMemories] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchMemories = async () => {
//             try {
//                 setIsLoading(true);
//                 const data = await getMyMemories();
//                 setMemories(data);
//             } catch (err) {
//                 console.error('Failed to fetch memories:', err);
//                 setError('Could not load your memories. Please try again later.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchMemories();
//     }, []);

//     if (isLoading) {
//         return <AppLayout><p>Loading your memories...</p></AppLayout>;
//     }

//     if (error) {
//         return <AppLayout><p style={{ color: 'red' }}>{error}</p></AppLayout>;
//     }

//     return (
//         <AppLayout>
//             {memories.length > 0 ? (
//                 // Nếu có memories, hiển thị danh sách
//                 <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
//                     {memories.map((memory) => (
//                         <Link
//                             key={memory.memoryID}
//                             to={`/memory/${memory.memoryID}`}
//                             className="block break-inside-avoid mb-4"
//                         >
//                             <Thread memory={memory} />
//                         </Link>
//                     ))}
//                 </div>
//             ) : (
//                 // Nếu không có memories, hiển thị lời mời tạo mới
//                 <div className="flex flex-col items-center justify-center h-full text-center">
//                     <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your SoulNote is empty</h2>
//                     <p className="text-gray-500 mb-6">It looks like you haven't saved any memories yet. Let's create your first one!</p>
//                     <button
//                         onClick={() => navigate('/create-memory')} // Dẫn đến trang tạo memory
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
//                     >
//                         Create New Memory
//                     </button>
//                 </div>
//             )}
//         </AppLayout>
//     );
// }

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import AppLayout from '../../components/AppLayout';
import { Thread } from '../../components/Thread'; // <<< Sửa lại cách import
import { getMyMemories } from '../../services/api';

// Component hiển thị khi đang tải dữ liệu
const LoadingSkeleton = () => (
  <div className="text-center p-10">
    <p className="text-gray-500">Loading your memories...</p>
    {/* Bạn có thể thêm một spinner hoặc skeleton loader ở đây cho đẹp hơn */}
  </div>
);

// Component hiển thị khi không có memory nào
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <h2 className="text-2xl font-semibold text-gray-800">Your SoulNote is empty</h2>
    <p className="mt-2 text-gray-500">It looks like you haven't saved any memories yet. Let's create your first one!</p>
    <Link to="/create-memory"> {/* <<< Giả sử bạn có route /create-memory để hiện form */}
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
        Create New Memory
      </button>
    </Link>
  </div>
);

export default function Dashboard() {
  // State để lưu memories, trạng thái loading và lỗi
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // <<< 2. Bắt đầu với trạng thái loading
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hàm để gọi API và cập nhật state
    const fetchMemories = async () => {
      try {
        const data = await getMyMemories();
        setMemories(data); // <<< 3. Cập nhật state với dữ liệu thật
      } catch (err)
      {
        console.error('Failed to fetch memories:', err);
        setError('Could not load your memories. Please try again later.');
      } finally {
        setIsLoading(false); // <<< 4. Dừng loading dù thành công hay thất bại
      }
    };

    fetchMemories();
  }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <AppLayout>
        <div className="text-center p-10 text-red-500">{error}</div>
      </AppLayout>
    );
  }

  // Hiển thị skeleton loader khi đang tải
  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton />
      </AppLayout>
    );
  }

  // <<< 5. Logic hiển thị: Nếu không loading và không có memory, hiển thị EmptyState
  if (!isLoading && memories.length === 0) {
    return (
      <AppLayout>
        <EmptyState />
      </AppLayout>
    );
  }

  // Nếu có memories, hiển thị danh sách
  return (
    <AppLayout>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {memories.map((memory) => (
          // <<< 6. Đảm bảo key và link sử dụng đúng ID từ backend (memory.memoryID)
          <Link
            key={memory.memoryID}
            to={`/memory/${memory.memoryID}`}
            className="block break-inside-avoid mb-4 transition duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-100 rounded-lg"
          >
            <Thread memory={memory} />
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}