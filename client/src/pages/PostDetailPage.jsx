import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, MoreHorizontal, MessageCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { mockPosts, currentUser } from '../utils/mockData';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = mockPosts.find(p => p._id === id) || mockPosts[0];
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white animate-fadeIn flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 px-4 md:px-8 max-w-7xl mx-auto w-full py-8">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-cardBg rounded-3xl border border-white/10 overflow-hidden flex flex-col lg:flex-row min-h-[600px] shadow-2xl">
          
          {/* Left: Image Area */}
          <div className="lg:w-3/5 relative bg-black flex items-center justify-center p-4">
            {/* Ambient Background Blur behind image */}
            <div 
              className="absolute inset-0 opacity-30 blur-3xl scale-110" 
              style={{ backgroundImage: `url(${post.imageLink})`, backgroundSize: 'cover' }} 
            />
            <img 
              src={post.imageLink} 
              alt={post.prompt} 
              className="max-h-[80vh] w-auto object-contain rounded-xl relative z-10 shadow-2xl"
            />
          </div>

          {/* Right: Info Area */}
          <div className="lg:w-2/5 p-6 md:p-8 flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar bg-cardBg z-20">
            
            {/* Header: User */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10 shrink-0">
              <Link to={`/profile/${post.user._id}`} className="flex items-center gap-3 group">
                <img src={post.user.Avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-white/20 group-hover:border-accentViolet transition-colors" />
                <div>
                  <h3 className="font-heading font-bold text-lg group-hover:text-accentCyan transition-colors">{post.user.name}</h3>
                  <p className="text-sm text-gray-400">@{post.user.name.replace(/\s+/g, '').toLowerCase()}</p>
                </div>
              </Link>
              <button className="text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            {/* Body: Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Prompt Detail</h4>
                <p className="text-gray-200 leading-relaxed font-body bg-white/5 p-4 rounded-xl border border-white/5">
                  "{post.prompt}"
                </p>
              </div>

              {post.caption && (
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Caption</h4>
                  <p className="text-gray-300 text-sm">{post.caption}</p>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between py-4 border-y border-white/10 my-4">
                <div className="flex items-center gap-6">
                  <button onClick={handleLike} className="flex items-center gap-2 group">
                    <Heart className={`w-7 h-7 transition-colors ${isLiked ? 'fill-accentViolet text-accentViolet' : 'text-white group-hover:text-accentViolet'}`} />
                    <span className="font-bold text-lg">{likesCount.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2 group">
                    <MessageCircle className="w-7 h-7 text-white group-hover:text-accentCyan transition-colors" />
                    <span className="font-bold text-lg">{post.comments.length}</span>
                  </button>
                </div>
                <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Comments */}
              <div className="space-y-6 pt-2 pb-20 lg:pb-0">
                <h4 className="font-heading font-medium text-lg">Comments</h4>
                {post.comments.map(comment => (
                  <div key={comment._id} className="flex gap-3">
                    <img src={comment.user.Avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-sm">{comment.user.name}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Comment Input Sticky Bottom */}
            <div className="sticky bottom-0 bg-cardBg pt-4 mt-auto border-t border-white/10 pb-4 lg:pb-0">
              <div className="flex items-center gap-3">
                <img src={currentUser.Avatar} alt="Your Avatar" className="w-8 h-8 rounded-full" />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-16 py-2.5 text-sm outline-none focus:border-accentViolet transition-colors placeholder-gray-500"
                  />
                  <button 
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold transition-colors ${commentText ? 'text-accentCyan hover:text-white' : 'text-gray-600'}`}
                    disabled={!commentText}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
