import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user && token) {
      setCurrentUser(JSON.parse(user));
    } else {
      setCurrentUser(null);
      setToken(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(data.token);
      setCurrentUser(data);
      toast.success('Welcome back! 👋');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const { data } = await api.post('/auth/google', { credential });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(data.token);
      setCurrentUser(data);
      if (data.isNewUser) {
        toast.success(`Welcome to SocialiX, ${data.name}! 🎉`);
      } else {
        toast.success(`Welcome back, ${data.name}! 👋`);
      }
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(data.token);
      setCurrentUser(data);
      toast.success('Account created! Check your email for a welcome message 🎉');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  // Update currentUser in state and localStorage
  const updateCurrentUser = (updatedUser) => {
    const merged = { ...currentUser, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(merged));
    setCurrentUser(merged);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, loading, login, loginWithGoogle, register, logout, updateCurrentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
