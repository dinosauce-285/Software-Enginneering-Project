import '../../index.css';
import AppLayout from '../../components/AppLayout'; 
import Thread from '../../components/Thread';
import sampleMemories from '../../data/sampleMemories.js';


export default function Dashboard() {
    return (
        <AppLayout>
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                {sampleMemories.map((memory) => (
                    <div key={memory.id} className="break-inside-avoid mb-4">
                        <Thread memory={memory} />
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}