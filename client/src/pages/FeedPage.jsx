import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import StoryBar from '../components/StoryBar';
import { mockPosts } from '../utils/mockData';

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('Latest');

  return (
    <div className="min-h-screen bg-darkBg text-white animate-fadeIn flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex pt-16 max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 min-w-0 p-4 lg:p-8">
          {/* Sticky Top Bar */}
          <div className="sticky top-16 z-40 bg-darkBg/80 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-white/5 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              
              <div className="flex gap-6 border-b border-white/10 w-full md:w-auto">
                {['Latest', 'Following'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-medium text-sm transition-colors relative ${
                      activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accentCyan rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prompts, tags..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accentCyan transition-colors text-white placeholder-gray-500"
                />
              </div>

            </div>
          </div>

          <StoryBar />

          {/* Masonry Grid */}
          <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {mockPosts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
