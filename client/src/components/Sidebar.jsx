import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Wand2, User, LogOut } from 'lucide-react';
import { currentUser } from '../utils/mockData';

const navItems = [
  { path: '/feed', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/generate', label: 'Generate', icon: Wand2 },
  { path: `/profile/${currentUser._id}`, label: 'Profile', icon: User },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex flex-col py-8 px-6 border-r border-white/10 shrink-0 bg-darkBg/50 backdrop-blur-sm">
      <nav className="flex-1 flex flex-col gap-2">
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
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all duration-300 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </NavLink>
      </div>
    </aside>
  );
}
