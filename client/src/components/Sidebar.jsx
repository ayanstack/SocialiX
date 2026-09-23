import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Wand2, User, LogOut, PlusSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navItems = [
    { path: '/feed', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/generate', label: 'Generate AI', icon: Wand2 },
    { path: `/profile/${currentUser?._id || currentUser?.id}`, label: 'Profile', icon: User },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const handlePostCreated = () => {
    // Navigate to feed or profile
    navigate(`/profile/${currentUser?._id || currentUser?.id}`);
    window.location.reload();
  };

  return (
    <>
      <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex flex-col py-8 px-6 border-r border-white/10 shrink-0 bg-darkBg/50 backdrop-blur-sm">
        <nav className="flex-1 flex flex-col gap-2">
          {/* Create Post Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-2 mb-4 py-3 px-4 rounded-xl bg-gradient-to-r from-accentViolet to-accentCyan text-white font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg"
          >
            <PlusSquare className="w-5 h-5" />
            Create Post
          </button>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-accentViolet/20 to-transparent text-accentCyan border-l-2 border-accentCyan w-full'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

      <div className="pt-8 mt-auto border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all duration-300 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>

    {showCreateModal && (
      <CreatePostModal
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    )}
  </>
  );
}
