import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, MapPin, Link as LinkIcon, Calendar, Pencil } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAvatarUrl } from '../utils/avatar';
import EditProfileModal from '../components/EditProfileModal';
import UserListModal from '../components/UserListModal';

export default function ProfilePage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const currentUserId = currentUser?._id || currentUser?.id;
  const isMe = currentUserId === id;
  const [showEditModal, setShowEditModal] = useState(false);
  const [userListModal, setUserListModal] = useState(null); // { title: 'Followers' | 'Following', users: [] }

  const [activeTab, setActiveTab] = useState('Posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, [id, currentUserId]);

  // Sync when currentUser updates (after profile edit)
  useEffect(() => {
    if (isMe && currentUser) setProfileUser(currentUser);
  }, [currentUser]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile user info
      let userRes = null;
      if (isMe) {
        userRes = await api.get('/profile/me');
      } else {
        userRes = await api.get(`/profile/user/${id}`).catch(() => null);
      }

      // Fetch posts
      const postsRes = await api.get('/posts');
      const allPosts = postsRes.data || [];

      // Posts created by profile user
      const filteredPosts = allPosts.filter(p => (p.user?._id || p.user?.id || p.user) === id);
      setUserPosts(filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      // Posts liked by profile user
      const liked = allPosts.filter(p => p.likes?.some(l => (l?._id || l)?.toString() === id));
      setLikedPosts(liked.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      if (userRes?.data) {
        setProfileUser(userRes.data);
        const followers = userRes.data.followers || [];
        const amIFollowing = followers.some(f => (f?._id || f)?.toString() === currentUserId?.toString());
        setIsFollowing(amIFollowing);
        setFollowersCount(followers.length);
      } else if (filteredPosts.length > 0) {
        setProfileUser(filteredPosts[0].user);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) return toast.error('Please log in');
    try {
      if (isFollowing) {
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
        await api.put(`/user/unfollow/${id}`);
        toast.success(`Unfollowed ${displayUser?.name || 'user'}`);
      } else {
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        await api.put(`/user/follow/${id}`);
        toast.success(`Following ${displayUser?.name || 'user'}`);
      }
      fetchProfileData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
      setIsFollowing(!isFollowing);
    }
  };

  const displayUser = profileUser || currentUser;
  const bannerSeed = encodeURIComponent(displayUser?.name || 'default');
  const displayedPosts = activeTab === 'Posts' ? userPosts : likedPosts;

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
                  src={`https://picsum.photos/seed/${bannerSeed}banner/1200/400`} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-transparent to-transparent" />
              </div>

              <div className="px-4 lg:px-8 max-w-5xl mx-auto">
                {/* Header Info */}
                <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20 mb-8">
                  <img 
                    src={getAvatarUrl(displayUser)} 
                    alt={displayUser?.name || 'User'} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-darkBg object-cover z-10 shadow-2xl relative bg-darkBg"
                  />
                  
                  <div className="flex-1 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-heading font-bold">{displayUser?.name || 'User'}</h1>
                      <p className="text-gray-400">@{displayUser?.name?.replace(/\s+/g, '').toLowerCase() || 'user'}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      {isMe ? (
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="px-6 py-2 rounded-full bg-gradient-to-r from-accentCyan/20 to-accentViolet/20 hover:from-accentCyan/30 hover:to-accentViolet/30 border border-accentCyan/30 font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
                        >
                          <Pencil className="w-4 h-4 text-accentCyan" />
                          Edit Profile
                        </button>
                      ) : (
                        <button 
                          onClick={handleFollowToggle}
                          className={`px-8 py-2 rounded-full font-medium transition-all ${
                            isFollowing 
                              ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white' 
                              : 'bg-gradient-to-r from-accentViolet to-accentCyan text-white hover:scale-105 shadow-lg font-bold'
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
                      {displayUser?.bio || "Digital creator & artist sharing AI art and visuals on Socialix."}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Neo Tokyo</span>
                      <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> <a href="#" className="text-accentCyan hover:underline">portfolio.io</a></span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined March 2026</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 h-fit justify-center md:justify-around">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-heading">{userPosts.length}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Posts</div>
                    </div>
                    
                    {/* Followers Clickable Stat */}
                    <div 
                      onClick={() => setUserListModal({ title: 'Followers', users: displayUser?.followers || [] })}
                      className="text-center cursor-pointer hover:opacity-80 transition-opacity px-2 py-1 rounded-xl hover:bg-white/5"
                    >
                      <div className="text-2xl font-bold font-heading text-accentCyan">{followersCount}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider underline underline-offset-4 decoration-accentCyan/40">Followers</div>
                    </div>
                    
                    {/* Following Clickable Stat */}
                    <div 
                      onClick={() => setUserListModal({ title: 'Following', users: displayUser?.following || [] })}
                      className="text-center cursor-pointer hover:opacity-80 transition-opacity px-2 py-1 rounded-xl hover:bg-white/5"
                    >
                      <div className="text-2xl font-bold font-heading text-accentViolet">{displayUser?.following?.length || 0}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider underline underline-offset-4 decoration-accentViolet/40">Following</div>
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
                      {tab} ({tab === 'Posts' ? userPosts.length : likedPosts.length})
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accentViolet rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Grid */}
                {displayedPosts.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">No {activeTab.toLowerCase()} found yet.</p>
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pb-12">
                    {displayedPosts.map(post => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                )}

              </div>
            </>
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}

      {/* Followers / Following List Modal */}
      {userListModal && (
        <UserListModal
          title={userListModal.title}
          users={userListModal.users}
          onClose={() => setUserListModal(null)}
          onFollowChange={fetchProfileData}
        />
      )}
    </div>
  );
}
