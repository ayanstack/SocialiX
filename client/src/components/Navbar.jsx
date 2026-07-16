import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Don't show complex nav on login/register/landing
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 lg:px-8 px-4 h-16 flex items-center justify-between">
      {/* Brand */}
      <Link to={isAuthPage ? "/" : "/feed"} className="flex items-center gap-2 group">
        <div className="bg-gradient-to-tr from-accentViolet to-accentCyan p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-accentViolet to-accentCyan tracking-wide">
          Socialix
        </span>
      </Link>

      {/* Main Links (Hidden on Auth/Landing pages) */}
      {!isAuthPage && (
        <div className="hidden md:flex items-center gap-6">
          <Link to="/explore" className="text-sm font-medium hover:text-accentCyan transition-colors">Explore</Link>
          <Link to="/generate" className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accentCyan" />
            Generate
          </Link>
        </div>
      )}

      {/* Right User Action */}
      <div className="flex items-center gap-4">
        {!isAuthPage && currentUser ? (
          <Link to={`/profile/${currentUser._id}`}>
            <img src={currentUser.Avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-accentViolet transition-all cursor-pointer bg-white/10" />
          </Link>
        ) : (
          location.pathname !== '/' && (
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Back to Home
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
