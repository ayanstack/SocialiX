import React, { useState, useEffect } from 'react';
import { X, UserCheck, UserPlus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../utils/avatar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

export default function UserListModal({ title, users = [], userId, onClose, onFollowChange }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const currentUserId = currentUser?._id || currentUser?.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [listUsers, setListUsers] = useState(users);
  const [loading, setLoading] = useState(false);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    fetchUsersList();
  }, [title, userId]);

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      let loadedUsers = users;
      const targetId = userId || currentUserId;

      // Fetch fresh populated user profile data to ensure full user objects
      const res = await api.get(`/profile/user/${targetId}`).catch(() => null);
      if (res?.data) {
        if (title.toLowerCase() === 'followers') {
          loadedUsers = res.data.followers || [];
        } else {
          loadedUsers = res.data.following || [];
        }
      }

      setListUsers(loadedUsers);

      // Map follow states relative to current logged-in user
      const map = {};
      loadedUsers.forEach(u => {
        const uId = u._id || u.id;
        map[uId] = u.followers?.some(f => (f._id || f)?.toString() === currentUserId?.toString());
      });
      setFollowingMap(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (targetId) => {
    onClose();
    navigate(`/profile/${targetId}`);
  };

  const handleToggleFollow = async (e, targetUserId, targetUserName) => {
    e.stopPropagation();
    if (!currentUser) return toast.error('Please log in');

    const isCurrentlyFollowing = followingMap[targetUserId];

    try {
      setFollowingMap(prev => ({ ...prev, [targetUserId]: !isCurrentlyFollowing }));
      if (isCurrentlyFollowing) {
        await api.put(`/user/unfollow/${targetUserId}`);
        toast.success(`Unfollowed @${targetUserName}`);
      } else {
        await api.put(`/user/follow/${targetUserId}`);
        toast.success(`Following @${targetUserName}`);
      }
      if (onFollowChange) onFollowChange();
    } catch (err) {
      setFollowingMap(prev => ({ ...prev, [targetUserId]: isCurrentlyFollowing }));
      toast.error('Action failed');
    }
  };

  const filteredUsers = listUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-darkBg border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-heading font-bold text-white capitalize">{title} ({listUsers.length})</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${title}...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accentCyan transition-colors"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No {title.toLowerCase()} found.</p>
            </div>
          ) : (
            filteredUsers.map((u) => {
              const uId = u._id || u.id;
              const isMe = uId === currentUserId;
              const isFollowing = followingMap[uId];
              const handle = u.name ? u.name.replace(/\s+/g, '').toLowerCase() : 'user';

              return (
                <div
                  key={uId}
                  onClick={() => handleUserClick(uId)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getAvatarUrl(u)}
                      alt={u.name || 'User'}
                      className="w-11 h-11 rounded-full object-cover border border-white/10 group-hover:border-accentCyan transition-colors bg-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-accentCyan transition-colors">
                        {u.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">@{handle}</p>
                    </div>
                  </div>

                  {!isMe && (
                    <button
                      onClick={(e) => handleToggleFollow(e, uId, u.name)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        isFollowing
                          ? 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/10'
                          : 'bg-gradient-to-r from-accentViolet to-accentCyan text-white hover:scale-105 shadow-md'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-accentCyan" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
