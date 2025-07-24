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



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import AppLayout from '../../components/AppLayout';
import  Thread from '../../components/Thread';
import { getMyMemories } from '../../services/api';

const LoadingSkeleton = () => (
  <div className="text-center p-10">
    <p className="text-gray-500">Loading your memories...</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <h2 className="text-2xl font-semibold text-gray-800">Your SoulNote is empty</h2>
    <p className="mt-2 text-gray-500">It looks like you haven't saved any memories yet. Let's create your first one!</p>
    <Link to="/create-memory">
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
        Create New Memory
      </button>
    </Link>
  </div>
);

export default function Dashboard() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await getMyMemories();
        setMemories(data);
      } catch (err) {
        console.error('Failed to fetch memories:', err);
        setError('Could not load your memories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, []);

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

  if (!isLoading && memories.length === 0) {
    return (
      <AppLayout>
        <EmptyState />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
        {memories.map((memory) => (
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