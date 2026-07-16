import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = (e) => {
    e.preventDefault();
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex flex-col items-center gap-3 w-48 shrink-0 hover:bg-white/10 transition-colors">
      <Link to={`/profile/${user._id}`}>
        <img 
          src={user.Avatar} 
          alt={user.name} 
          className="w-20 h-20 rounded-full object-cover border-2 border-accentViolet p-0.5"
        />
      </Link>
      
      <div className="text-center w-full">
        <Link to={`/profile/${user._id}`} className="block font-medium text-white hover:text-accentCyan transition-colors truncate">
          {user.name}
        </Link>
        <p className="text-xs text-gray-400">{(user.followers.length + (isFollowing ? 1 : 0)).toLocaleString()} followers</p>
      </div>
      
      <button 
        onClick={toggleFollow}
        className={`w-full py-1.5 rounded-full text-sm font-medium transition-all ${
          isFollowing 
            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
            : 'bg-gradient-to-r from-accentViolet to-accentCyan text-white hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}
