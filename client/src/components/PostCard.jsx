import React, { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const currentUserId = currentUser?._id || currentUser?.id;
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes?.some(like => (like?._id || like)?.toString() === currentUserId?.toString()));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const userId = post.user?._id || post.user?.id || post.user;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error('Please log in to like posts');
      return;
    }

    try {
      // Optimistic UI update
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
      
      await api.put(`/posts/${post._id}`);
    } catch (error) {
      // Revert if API fails
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : Math.max(0, prev - 1));
      toast.error('Failed to like post');
    }
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <Link 
      to={`/post/${post._id}`}
      className="block relative rounded-2xl overflow-hidden group mb-4 break-inside-avoid bg-cardBg border border-white/5 hover:border-white/20 transition-all shadow-md hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={post.imageLink} 
        alt={post.prompt || post.caption} 
        className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 truncate max-w-[140px]">
            {post.caption || post.prompt}
          </span>
          <button 
            onClick={handleLike}
            className={`px-3 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold ${
              isLiked ? 'bg-accentViolet text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-white' : ''}`} />
            <span>{likesCount}</span>
          </button>
        </div>
        
        <div className="flex justify-center flex-1 items-center">
          <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-4 h-4" />
            View Post
          </div>
        </div>

        {/* Creator Info (Clickable) */}
        <div 
          onClick={handleProfileClick}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors cursor-pointer transform translate-y-4 group-hover:translate-y-0 duration-300"
        >
          <img src={getAvatarUrl(post.user)} alt={post.user?.name || 'User'} className="w-8 h-8 rounded-full border border-white/20 object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate hover:underline">{post.user?.name || 'User'}</p>
            <p className="text-[10px] text-gray-300 truncate">@{post.user?.name?.replace(/\s+/g, '').toLowerCase() || 'user'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
