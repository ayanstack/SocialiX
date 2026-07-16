import React from 'react';
import { mockUsers } from '../utils/mockData';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StoryBar() {
  const { currentUser } = useAuth();
  
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar flex gap-4">
      {/* Current User Story Add */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
        <div className="relative w-16 h-16 rounded-full p-0.5 bg-white/10 group-hover:bg-accentViolet transition-colors">
          <img src={currentUser?.Avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`} alt="You" className="w-full h-full rounded-full object-cover border-2 border-darkBg" />
          <div className="absolute bottom-0 right-0 bg-accentViolet rounded-full p-1 border-2 border-darkBg">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">You</span>
      </div>

      {/* Mock User Stories */}
      {mockUsers.slice(0, 8).map(user => (
        <div key={user._id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-accentViolet to-accentCyan">
            <img src={user.Avatar} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-darkBg" />
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white transition-colors truncate w-16 text-center">
            {user.name.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
}
