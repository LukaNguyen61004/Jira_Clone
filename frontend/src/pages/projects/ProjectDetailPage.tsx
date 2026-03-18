import { useState } from 'react';
import BoardPage from './BoardPage';


export default function ProjectDetailPage() {
    const [activeTab, setActiveTab] = useState('board');

    return (
        <div className="flex  h-screen">
             {/*Side bar*/}
            <div className="w-56 border-r p-4">
                <ul className="space-y-1">
                    <li>
                        <button onClick={() => setActiveTab('board')}
                            className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'board' ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            Board
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('backlog')}
                            className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'backlog' ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            Backlog
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'members' ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            Members
                        </button>
                    </li>
                </ul>
            </div>

            {/*Main content*/}
            <div className="flex-1 p-8">
                {activeTab === 'board' && <BoardPage />}
                {activeTab === 'backlog' && <div>Backlog Page</div>}
                {activeTab === 'members' && <div>Members Page</div>}
            </div>


        </div>
    )
}