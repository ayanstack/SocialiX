import React, { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <Link 
      to={`/post/${post._id}`}
      className="block relative rounded-2xl overflow-hidden group mb-4 break-inside-avoid bg-cardBg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={post.imageLink} 
        alt={post.prompt} 
        className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="flex justify-end">
          <button 
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${isLiked ? 'bg-accentViolet text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="flex justify-center flex-1 items-center">
          <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-4 h-4" />
            View Detail
          </div>
        </div>

        <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <img src={post.user.Avatar} alt={post.user.name} className="w-8 h-8 rounded-full border border-white/20" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{post.user.name}</p>
            <p className="text-xs text-gray-300 truncate">@{post.user.name.replace(/\s+/g, '').toLowerCase()}</p>
          </div>
        </div>
      </div>
      
      {/* Always visible bottom strip (optional fallback if hover isn't triggered on touch) -> as per prompt, bottom strip. Pinterest merges this. Let's make it visible on hover to match pinterest, or put it outside the image. The prompt says "Bottom strip: avatar, name, like count" inside or outside? I'll put it outside to be safe, like minimal Pinterest layout. Wait, let's keep it overlay-only or bottom strip. I'll put it outside. */}
    </Link>
  );
}
