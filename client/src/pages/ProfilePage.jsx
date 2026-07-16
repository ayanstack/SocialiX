import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Posts');
  const [isFollowing, setIsFollowing] = useState(false);
  
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    fetchUserPosts();
  }, [id]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts');
      // Filter posts that belong to this profile user
      const filtered = data.filter(p => p.user?._id === id);
      setUserPosts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      // Determine profile info (If it's me, use currentUser, else try to extract from their posts)
      if (id === currentUser?._id) {
        setProfileUser(currentUser);
      } else if (filtered.length > 0) {
        setProfileUser(filtered[0].user);
      }
    } catch (error) {
      toast.error('Failed to load profile posts');
    } finally {
      setLoading(false);
    }
  };

  const isMe = currentUser?._id === id;
  const displayUser = profileUser || currentUser; // Fallback if no posts

  return (
    <div className="min-h-screen bg-darkBg text-white animate-fadeIn flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex pt-16 max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 min-w-0">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <LoadingSpinner />
             </div>
          ) : (
            <>
              {/* Banner */}
              <div className="h-48 md:h-64 w-full relative">
                <img 
                  src={`https://picsum.photos/seed/${displayUser?._id || 'default'}banner/1200/400`} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-transparent to-transparent" />
              </div>

              <div className="px-4 lg:px-8 max-w-5xl mx-auto">
                {/* Header Info */}
                <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20 mb-8">
                  <img 
                    src={displayUser?.Avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUser?.name}`} 
                    alt={displayUser?.name} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-darkBg object-cover z-10 shadow-2xl relative bg-darkBg"
                  />
                  
                  <div className="flex-1 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-heading font-bold">{displayUser?.name || 'User'}</h1>
                      <p className="text-gray-400">@{displayUser?.name?.replace(/\s+/g, '').toLowerCase() || 'user'}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      {isMe ? (
                        <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 font-medium transition-colors flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <button 
                          onClick={() => setIsFollowing(!isFollowing)}
                          className={`px-8 py-2 rounded-full font-medium transition-all ${
                            isFollowing 
                              ? 'bg-white/10 hover:bg-white/20 border border-white/20' 
                              : 'bg-gradient-to-r from-accentViolet to-accentCyan text-white hover:scale-105 shadow-lg'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-gray-300 leading-relaxed max-w-2xl">
                      {displayUser?.bio || "Digital artist specializing in surreal, dreamy, and cyberpunk aesthetic landscapes generated through intricate prompting and curation."}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Neo Tokyo</span>
                      <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> <a href="#" className="text-accentCyan hover:underline">portfolio.io</a></span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined March 2026</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-8 bg-white/5 border border-white/10 rounded-2xl p-6 h-fit justify-center md:justify-around">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-heading">{userPosts.length}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-heading">{(displayUser?.followers?.length || 0) + (isFollowing ? 1 : 0)}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-heading">{displayUser?.following?.length || 0}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Following</div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-white/10 mb-8">
                  {['Posts', 'Liked'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 font-medium text-lg transition-colors relative ${
                        activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accentViolet rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pb-12">
                  {userPosts.map(post => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>

              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
