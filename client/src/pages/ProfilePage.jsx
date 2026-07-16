import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import { currentUser, mockUsers, mockPosts } from '../utils/mockData';

export default function ProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // Simple mock resolver
  const isMe = id === currentUser._id;
  const user = isMe ? currentUser : (mockUsers.find(u => u._id === id) || mockUsers[0]);
  const userPosts = mockPosts.filter(p => isMe ? p.user._id === currentUser._id : true).slice(0, 12);

  return (
    <div className="min-h-screen bg-darkBg text-white animate-fadeIn flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex pt-16 max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 min-w-0">
          {/* Banner */}
          <div className="h-48 md:h-64 w-full relative">
            <img 
              src={`https://picsum.photos/seed/${user._id}banner/1200/400`} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-transparent to-transparent" />
          </div>

          <div className="px-4 lg:px-8 max-w-5xl mx-auto">
            {/* Header Info */}
            <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20 mb-8">
              <img 
                src={user.Avatar} 
                alt={user.name} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-darkBg object-cover z-10 shadow-2xl relative bg-darkBg"
              />
              
              <div className="flex-1 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
                <div className="space-y-1">
                  <h1 className="text-3xl font-heading font-bold">{user.name}</h1>
                  <p className="text-gray-400">@{user.name.replace(/\s+/g, '').toLowerCase()}</p>
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
                  {user.bio || "Digital artist specializing in surreal, dreamy, and cyberpunk aesthetic landscapes generated through intricate prompting and curation."}
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
                  <div className="text-2xl font-bold font-heading">{(user.followers.length + (isFollowing ? 1 : 0)).toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-heading">{user.following.length.toLocaleString()}</div>
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
        </main>
      </div>
    </div>
  );
}
