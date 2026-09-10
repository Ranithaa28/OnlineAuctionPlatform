import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Import getCurrentUser dynamically to avoid circular dependencies if any
          const { getCurrentUser } = await import('../services/authService');
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to restore session:", error);
          // 401 triggers token removal in authService
          setUser(null);
        }
      } else {
         const storedUser = localStorage.getItem('user');
         if (storedUser) {
           setUser(JSON.parse(storedUser));
         }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await loginUser(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const registeredUser = await registerUser(userData);
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
