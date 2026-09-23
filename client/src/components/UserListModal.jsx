import React, { useState } from 'react';
import { X, UserCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../utils/avatar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function UserListModal({ title, users = [], onClose, onFollowChange }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const currentUserId = currentUser?._id || currentUser?.id;

  // Track follow state per user
  const [followingMap, setFollowingMap] = useState(() => {
    const map = {};
    users.forEach(u => {
      const uId = u._id || u.id;
      // Check if current logged in user follows this user
      map[uId] = u.followers?.some(f => (f._id || f)?.toString() === currentUserId?.toString());
    });
    return map;
  });

  const handleUserClick = (userId) => {
    onClose();
    navigate(`/profile/${userId}`);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-darkBg border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-heading font-bold text-white capitalize">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-white/5">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No {title.toLowerCase()} found.</p>
            </div>
          ) : (
            users.map((u) => {
              const uId = u._id || u.id;
              const isMe = uId === currentUserId;
              const isFollowing = followingMap[uId];
              const handle = u.name ? u.name.replace(/\s+/g, '').toLowerCase() : 'user';

              return (
                <div
                  key={uId}
                  onClick={() => handleUserClick(uId)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
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
