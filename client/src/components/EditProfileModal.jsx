import React, { useState, useRef } from 'react';
import { X, Camera, User, FileText, Save, Loader2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';

export default function EditProfileModal({ onClose }) {
  const { currentUser, updateCurrentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('bio', bio.trim());
      if (avatarFile) formData.append('avatar', avatarFile);

      const { data } = await api.put('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateCurrentUser(data);
      toast.success('Profile updated! ✨');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar = avatarPreview || getAvatarUrl(currentUser);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Modal */}
        <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden animate-fadeIn">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <h2 className="text-lg font-bold text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                <img
                  src={currentAvatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-accentCyan/50 transition-all duration-300"
                />
                {/* Overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
                {/* Badge */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-accentCyan to-accentViolet flex items-center justify-center shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <p className="text-xs text-gray-500">Click the camera icon to change your photo</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              {avatarFile && (
                <span className="text-xs text-accentCyan bg-accentCyan/10 border border-accentCyan/20 px-3 py-1 rounded-full">
                  📷 {avatarFile.name}
                </span>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="w-full bg-black/20 border border-white/[0.08] hover:border-white/20 focus:border-accentCyan rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-all"
                placeholder="Your display name"
              />
              <p className="text-right text-xs text-gray-600">{name.length}/50</p>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={150}
                className="w-full bg-black/20 border border-white/[0.08] hover:border-white/20 focus:border-accentCyan rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-all resize-none"
                placeholder="Tell the world about yourself..."
              />
              <p className="text-right text-xs text-gray-600">{bio.length}/150</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-gray-300 font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-accentCyan to-accentViolet text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-accentCyan/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
