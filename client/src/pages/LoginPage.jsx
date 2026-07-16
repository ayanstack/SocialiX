import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4 relative animate-fadeIn">
      <Navbar />
      
      {/* Background glow */}
      <div className="absolute w-full h-[500px] bg-accentViolet/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 z-10 shadow-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accentCyan/30 rounded-full blur-[50px] pointer-events-none" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Log in to continue exploring Socialix.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentViolet transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <a href="#" className="text-xs text-accentCyan hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentViolet transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-accentViolet to-accentCyan text-white font-medium hover:scale-[1.02] transition-transform shadow-lg shadow-accentViolet/20"
          >
            Log In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-accentCyan font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
