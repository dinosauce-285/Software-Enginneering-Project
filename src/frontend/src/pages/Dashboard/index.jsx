import { Link } from 'react-router-dom';
import '../../index.css';
import AppLayout from '../../components/AppLayout';
import Thread from '../../components/Thread';
import sampleMemories from '../../data/sampleMemories.js';

export default function Dashboard() {
    return (
        <AppLayout>
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                {sampleMemories.map((memory) => (
                    <Link
                        key={memory.id}
                        to={`/memory/${memory.id}`}
                        className="block break-inside-avoid mb-4 transition duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-100 rounded-lg"
                    >
                        <Thread memory={memory} />
                    </Link>

                ))}
            </div>
        </AppLayout>
    );
}
