import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const styles = ['Realistic', 'Anime', 'Oil Painting', 'Cyberpunk', 'Watercolor', 'Sketch'];

export default function GenerateModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Cyberpunk");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setResultImage(null);
    
    try {
      // Append style to prompt
      const finalPrompt = `${prompt} in ${selectedStyle} style`;
      const { data } = await api.post('/posts', { 
        prompt: finalPrompt, 
        caption: `Created with ${selectedStyle} style: ${prompt}` 
      });
      
      setResultImage(data.imageLink);
      toast.success('Image generated successfully!');
      
      // Delay closing modal and redirecting
      setTimeout(() => {
        onClose();
        navigate(`/post/${data._id}`);
      }, 2000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-cardBg w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accentCyan" />
            <h2 className="text-lg font-heading font-medium text-white">Generate Art</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your imagination..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-accentViolet transition-colors resize-none disabled:opacity-50"
                disabled={isGenerating}
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm text-gray-300 font-medium">Style</label>
              <div className="flex flex-wrap gap-2">
                {styles.map(style => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedStyle === style 
                        ? 'bg-accentViolet text-white border-transparent' 
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accentViolet to-accentCyan text-white font-medium hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner className="w-5 h-5 text-white" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>

          <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
             <div className="flex-1 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center min-h-[300px] overflow-hidden relative">
               {isGenerating && <LoadingSpinner />}
               {!isGenerating && !resultImage && (
                 <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                   <ImageIcon className="w-8 h-8 opacity-50" />
                   <span className="text-sm">Preview</span>
                 </div>
               )}
               {resultImage && (
                 <img src={resultImage} alt="Generated result" className="w-full h-full object-cover animate-fadeIn" />
               )}
             </div>

             {resultImage && (
               <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium">
                 Share to Feed
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
