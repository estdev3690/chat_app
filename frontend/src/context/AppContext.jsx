import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const BACKEND_URL = 'https://chat-app-hu6l.onrender.com';

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.expiry && parsedUser.expiry > Date.now()) {
        return parsedUser;
      }
      localStorage.removeItem('user');
    }
    return null;
  });

  const login = (userData) => {
    const userWithExpiry = {
      ...userData,
      expiry: Date.now() + 12 * 60 * 60 * 1000, // 12 hours
    };
    localStorage.setItem('user', JSON.stringify(userWithExpiry));
    setUser(userWithExpiry);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    backendUrl: BACKEND_URL
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 