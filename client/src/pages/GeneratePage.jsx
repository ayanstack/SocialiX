import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Download, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const styles = ['Realistic', 'Anime', 'Oil Painting', 'Cyberpunk', 'Watercolor', 'Sketch', '3D Render', 'Origami'];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Cyberpunk");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setResultImage(null);
    setTimeout(() => {
      setResultImage(`https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/800/800`);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white animate-fadeIn flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex pt-16 max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 min-w-0 p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
          
          {/* Controls Panel */}
          <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">Create Art</h1>
              <p className="text-gray-400 text-sm">Transform your thoughts into stunning visuals.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Prompt Text</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your imagination in detail..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-accentViolet transition-colors resize-none disabled:opacity-50"
                disabled={isGenerating}
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Art Style</label>
              <div className="flex flex-wrap gap-2">
                {styles.map(style => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedStyle === style 
                        ? 'bg-accentViolet text-white border-transparent shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full py-4 mt-auto rounded-2xl bg-gradient-to-r from-accentViolet to-accentCyan text-white font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner className="w-6 h-6 text-white" />
                  Visualizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Output
                </>
              )}
            </button>
          </div>

          {/* Result Panel */}
          <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden min-h-[500px] relative">
            <div className="flex-1 flex items-center justify-center p-8 relative">
              {/* Background glow when idle */}
              {!resultImage && !isGenerating && (
                <div className="absolute w-64 h-64 bg-accentViolet/10 rounded-full blur-[100px] pointer-events-none" />
              )}
              
              {isGenerating && (
                 <div className="flex flex-col items-center gap-4">
                   <LoadingSpinner className="w-12 h-12" />
                   <p className="text-accentCyan animate-pulse">Dreaming up your vision...</p>
                 </div>
              )}
              
              {!isGenerating && !resultImage && (
                 <div className="text-center text-gray-500 flex flex-col items-center gap-4 z-10">
                   <div className="bg-white/5 p-6 rounded-full">
                     <ImageIcon className="w-12 h-12 opacity-50" />
                   </div>
                   <p>Your generated artwork will appear here</p>
                 </div>
              )}

              {resultImage && (
                 <img 
                   src={resultImage} 
                   alt="Generated Art" 
                   className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl animate-[fadeIn_1s_ease-out]" 
                 />
              )}
            </div>

            {/* Post-generation actions */}
            {resultImage && (
              <div className="p-4 border-t border-white/10 bg-black/20 flex gap-4 justify-end animate-fadeIn">
                <button className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Save
                </button>
                <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-accentViolet to-accentCyan text-white font-medium hover:scale-105 transition-transform flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share to Feed
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
