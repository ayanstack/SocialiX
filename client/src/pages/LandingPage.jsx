import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Images, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-darkBg text-white overflow-hidden animate-fadeIn font-body pb-20">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-32 px-4 relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accentViolet/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accentCyan/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="flex-1 text-center md:text-left space-y-8 z-10 w-full">
          <div className="inline-block border border-accentViolet/30 bg-accentViolet/10 text-accentViolet px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Socialix AI v2.0 is Live 🚀
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
            Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentViolet to-accentCyan">Imagination</span> Into Art
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto md:mx-0">
            Join the premier social network for AI artists. Generate stunning visuals, share with the community, and get inspired by infinite possibilities.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4 w-full">
            <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-accentViolet to-accentCyan text-white font-medium text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              Get Started
            </Link>
            <Link to="/explore" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-lg hover:bg-white/20 transition-all text-center">
              Explore Gallery
            </Link>
          </div>
        </div>

        {/* Floating Cards Display */}
        <div className="flex-1 relative h-[500px] w-full hidden md:block">
           <img src="https://picsum.photos/seed/landing1/400/500" alt="Art 1" className="absolute top-10 left-10 w-64 h-80 object-cover rounded-2xl border border-white/10 animate-[bounce_8s_infinite] shadow-2xl" />
           <img src="https://picsum.photos/seed/landing2/400/500" alt="Art 2" className="absolute top-40 right-10 w-64 h-80 object-cover rounded-2xl border border-white/10 animate-[bounce_9s_infinite_reverse] shadow-2xl z-20" />
           <img src="https://picsum.photos/seed/landing3/400/500" alt="Art 3" className="absolute -bottom-10 left-1/3 w-56 h-72 object-cover rounded-2xl border border-white/10 animate-[bounce_10s_infinite] shadow-2xl z-10" />
        </div>
      </main>

      {/* Features Section */}
      <section className="mt-40 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Unleash Your Creativity</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to create, explore, and share breathtaking AI masterpieces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Lightning Fast Generation", desc: "Turn text into hyper-realistic images in seconds." },
            { icon: Users, title: "Vibrant Community", desc: "Connect with thousands of AI artists worldwide." },
            { icon: Images, title: "Infinite Inspiration", desc: "Discover daily trending prompts and styles." }
          ].map((feature, i) => (
             <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
               <div className="bg-accentViolet/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                 <feature.icon className="w-7 h-7 text-accentViolet" />
               </div>
               <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
               <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 max-w-7xl mx-auto border-t border-white/10 pt-8 px-4 flex flex-col md:flex-row items-center justify-between text-gray-500">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Sparkles className="w-4 h-4 text-accentCyan" />
          <span className="font-heading font-bold text-white">Socialix</span>
          <span className="text-sm">© 2026</span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </footer>
    </div>
  );
}
