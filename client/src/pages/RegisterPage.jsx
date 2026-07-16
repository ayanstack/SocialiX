import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {

  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
  })

  const { name, email, phone, password, bio } = formdata
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(formdata);
    setIsSubmitting(false);
    if (success) {
      navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4 relative animate-fadeIn pt-16">
      <Navbar />
      {/* Background glow */}
      <div className="absolute w-full h-[500px] bg-accentCyan/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 z-10 shadow-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-accentViolet/30 rounded-full blur-[50px] pointer-events-none" />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join the AI art revolution today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentCyan transition-colors"
              placeholder="Your Name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentCyan transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={handleChange}
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentCyan transition-colors"
              placeholder="+91911234567890"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentCyan transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Your Bio</label>
            <textarea
              type="text"
              name="bio"
              value={bio}
              onChange={handleChange}
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentCyan transition-colors"
              placeholder="Enter Your Bio"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-6 rounded-xl bg-gradient-to-r from-accentCyan to-accentViolet text-white font-medium hover:scale-[1.02] transition-transform shadow-lg shadow-accentCyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-accentViolet font-medium transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
