import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

export default function CreatePostModal({ onClose, onPostCreated }) {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !imageUrl) {
      toast.error('Please select an image file or provide an image link!');
      return;
    }

    setIsSubmitting(true);
    try {
      let data;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('caption', caption);
        formData.append('prompt', caption || 'User Upload');
        
        const res = await api.post('/posts/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        data = res.data;
      } else {
        const res = await api.post('/posts/create', {
          imageLink: imageUrl,
          caption,
          prompt: caption || 'User Link',
        });
        data = res.data;
      }

      toast.success('Post published successfully!');
      if (onPostCreated) onPostCreated(data);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-darkBg border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-accentViolet to-accentCyan">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white">Create New Post</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Upload Method Toggle */}
          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl text-sm font-medium">
            <button
              type="button"
              onClick={() => { setUploadType('file'); setPreview(imageFile ? URL.createObjectURL(imageFile) : null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                uploadType === 'file' ? 'bg-accentViolet text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Upload Device Image
            </button>
            <button
              type="button"
              onClick={() => { setUploadType('url'); setPreview(imageUrl || null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                uploadType === 'url' ? 'bg-accentViolet text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Paste Image URL
            </button>
          </div>

          {/* Image Input Section */}
          {uploadType === 'file' ? (
            <div className="relative border-2 border-dashed border-white/20 hover:border-accentCyan rounded-2xl p-6 text-center transition-colors cursor-pointer bg-white/5">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {preview ? (
                <div className="relative max-h-56 overflow-hidden rounded-xl">
                  <img src={preview} alt="Preview" className="max-h-56 mx-auto object-cover rounded-xl shadow-lg" />
                  <p className="mt-2 text-xs text-accentCyan">Click or drag to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="p-3 bg-white/10 rounded-full text-accentCyan">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">Click or drag an image here to upload</p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP supported</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-accentCyan" /> Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value); }}
                placeholder="https://example.com/my-image.jpg"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accentCyan transition-colors"
              />
              {preview && (
                <div className="mt-3 max-h-48 overflow-hidden rounded-xl border border-white/10">
                  <img src={preview} alt="URL Preview" className="max-h-48 mx-auto object-cover rounded-xl" />
                </div>
              )}
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Caption / Description</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your post..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-accentViolet transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/10 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!imageFile && !imageUrl)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accentViolet to-accentCyan text-white font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="w-4 h-4" />
                  Publishing...
                </>
              ) : (
                'Share Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
