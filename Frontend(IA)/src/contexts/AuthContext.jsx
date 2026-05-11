import React, { createContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { signalRService } from '../lib/signalr';
import toast from 'react-hot-toast';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          const userData = {
            id: parseInt(payload.nameid || payload.sub),
            fullName: payload.unique_name || payload.email,
            email: payload.email,
            role: payload.role,
            isApproved: true,
            createdAt: '',
          };
          setUser(userData);
          setToken(storedToken);
          if (userData.role === 'Vendor') {
            signalRService.startConnection(storedToken);
          }
        } catch (e) {
          console.error('Token parse error', e);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      if (userData.role === 'Vendor') {
        signalRService.startConnection(newToken);
      }
      toast.success(`Welcome, ${userData.fullName}!`);
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    signalRService.stopConnection();
    toast.success('Logged out');
  };

  const value = {
    user,
    token,
    isInitialized,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isVendor: user?.role === 'Vendor',
    isCustomer: user?.role === 'Customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};