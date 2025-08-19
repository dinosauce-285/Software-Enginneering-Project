// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import '../../index.css';
// import AppLayout from '../../components/AppLayout';
// import  Thread from '../../components/Thread';
// import { getMyMemories } from '../../services/api';

// const LoadingSkeleton = () => (
//   <div className="text-center p-10">
//     <p className="text-gray-500">Loading your memories...</p>
//   </div>
// );

// const EmptyState = () => (
//   <div className="flex flex-col items-center justify-center h-[60vh] text-center">
//     <h2 className="text-2xl font-semibold text-gray-800">Your SoulNote is empty</h2>
//     <p className="mt-2 text-gray-500">It looks like you haven't saved any memories yet. Let's create your first one!</p>
//     <Link to="/create-memory">
//       <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
//         Create New Memory
//       </button>
//     </Link>
//   </div>
// );

// export default function Dashboard() {
//   const [memories, setMemories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMemories = async () => {
//       try {
//         const data = await getMyMemories();
//         setMemories(data);
//       } catch (err) {
//         console.error('Failed to fetch memories:', err);
//         setError('Could not load your memories. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMemories();
//   }, []);

//   if (error) {
//     return (
//       <AppLayout>
//         <div className="text-center p-10 text-red-500">{error}</div>
//       </AppLayout>
//     );
//   }

//   if (isLoading) {
//     return (
//       <AppLayout>
//         <LoadingSkeleton />
//       </AppLayout>
//     );
//   }

//   if (!isLoading && memories.length === 0) {
//     return (
//       <AppLayout>
//         <EmptyState />
//       </AppLayout>
//     );
//   }

//   return (
//     <AppLayout>
//       <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
//         {memories.map((memory) => (
//           <Link
//             key={memory.memoryID}
//             to={`/memory/${memory.memoryID}`}
//             className="block break-inside-avoid mb-4 transition duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-100 rounded-lg"
//           >
//             <Thread memory={memory} />
//           </Link>
//         ))}
//       </div>
//     </AppLayout>
//   );
// }
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import AppLayout from '../../components/AppLayout';
import Thread from '../../components/Thread';
import { useSearch } from '../../contexts/SearchContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { getMyMemories, searchMemories } from '../../services/api';

const LoadingSkeleton = () => (
  <div className="text-center p-10">
    <p className="text-gray-500">Loading your memories...</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Your SoulNote is empty</h2>
    <p className="mt-2 text-gray-500">It looks like you haven't saved any memories yet. Let's create your first one!</p>
    <Link to="/create-memory">
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
        Create New Memory
      </button>
    </Link>
  </div>
);

const NoResultsState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <h2 className="text-2xl font-semibold text-gray-800">No memories found</h2>
    <p className="mt-2 text-gray-500">We couldn't find any memories matching your search criteria.</p>
    <button
      onClick={onClear}
      className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
    >
      Clear Search
    </button>
  </div>
);

export default function Dashboard() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    searchText, setSearchText,
    selectedEmotions, setSelectedEmotions,
    fromDate, setFromDate,
    toDate, setToDate
  } = useSearch();
  const debouncedSearchText = useDebounce(searchText, 500);

  useEffect(() => {
    const fetchAndFilterMemories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const searchParams = {
          query: debouncedSearchText,
          emotions: selectedEmotions.length > 0 ? selectedEmotions.join(',') : null,
          startDate: fromDate ? fromDate.toISOString().split('T')[0] : null,
          endDate: toDate ? toDate.toISOString().split('T')[0] : null,
        };

        const filteredParams = Object.fromEntries(
          Object.entries(searchParams).filter(([_, v]) => v !== null && v !== '')
        );

        const hasSearchParams = Object.keys(filteredParams).length > 0;
        console.log('[FRONTEND] Sending to API:', filteredParams);

        let data;
        if (hasSearchParams) {
          data = await searchMemories(filteredParams);
        } else {
          data = await getMyMemories();
        }

        setMemories(data);

      } catch (err) {
        console.error('Failed to fetch or search memories:', err);
        setError('Could not load your memories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterMemories();
  }, [debouncedSearchText, selectedEmotions, fromDate, toDate]);

  const clearSearch = () => {
    setSearchText('');
    setSelectedEmotions([]);
    setFromDate(null);
    setToDate(null);
  };

  if (error) {
    return (
      <AppLayout>
        <div className="text-center p-10 text-red-500">{error}</div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton />
      </AppLayout>
    );
  }

  const isSearching = searchText || selectedEmotions.length > 0 || fromDate || toDate;

  if (memories.length === 0 && isSearching) {
    return (
      <AppLayout>
        <NoResultsState onClear={clearSearch} />
      </AppLayout>
    );
  }

  if (memories.length === 0 && !isSearching) {
    return (
      <AppLayout>
        <EmptyState />
      </AppLayout>
    );
  }

  // return (
  //   <AppLayout>
  //     <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
  //       {memories.map((memory) => (
  //         <Link
  //           key={memory.memoryID}
  //           to={`/memory/${memory.memoryID}`}
  //           className="block break-inside-avoid mb-4 transition duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-100 rounded-lg"
  //         >
  //           <Thread memory={memory} />
  //         </Link>
  //       ))}
  //     </div>
  //   </AppLayout>
  // );
  return (
    <AppLayout>
      {/* THÊM MÀU NỀN CHO DIV NÀY */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 bg-white dark:bg-gray-900">
        {memories.map((memory) => (
          <Link
            key={memory.memoryID}
            to={`/memory/${memory.memoryID}`}
            /* 
              ĐƯA TOÀN BỘ STYLE CỦA CARD VÀO ĐÂY
              - Thêm nền mặc định và nền cho dark mode
              - Thêm hiệu ứng hover cho dark mode
              - Giữ lại các hiệu ứng khác
            */
            className="block break-inside-avoid mb-4 transition duration-200 overflow-hidden
                     bg-[#F9F9F2] dark:bg-gray-800 
                     rounded-2xl shadow-sm
                     hover:shadow-lg hover:-translate-y-1 
                     dark:hover:bg-gray-700" // <- Hiệu ứng hover cho dark mode
          >
            <Thread memory={memory} />
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}