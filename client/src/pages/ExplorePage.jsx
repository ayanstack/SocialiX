import React, { useState, useEffect } from 'react';
import { Search, Flame } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import { mockUsers, trendingTags } from '../utils/mockData';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts');
      // For explore, maybe we want random order or just sort by likes
      const sortedPosts = data.sort((a, b) => b.likes?.length - a.likes?.length);
      setPosts(sortedPosts);
    } catch (error) {
      toast.error('Failed to load explore posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white animate-fadeIn flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex pt-16 max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-hidden">
          {/* Top Search Area */}
          <div className="max-w-3xl mx-auto mb-10 text-center space-y-6">
            <h1 className="text-4xl font-heading font-bold">Find Inspiration</h1>
            <div className="relative w-full max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for tags, styles, or creators..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-4 text-base focus:outline-none focus:border-accentViolet focus:bg-white/10 transition-all text-white placeholder-gray-500 shadow-xl"
              />
            </div>
          </div>

          {/* Trending Tags */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-heading font-medium">Trending Tokens</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {trendingTags.map(tag => (
                <button key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-accentCyan transition-colors whitespace-nowrap text-sm text-gray-300">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Creators */}
          <div className="mb-12">
            <h2 className="text-lg font-heading font-medium mb-4">Featured Creators</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 p-1">
              {mockUsers.map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          </div>

          {/* Grid */}
          <div>
            <h2 className="text-lg font-heading font-medium mb-4">Discover</h2>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <LoadingSpinner />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-400 py-10">No posts found.</div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
