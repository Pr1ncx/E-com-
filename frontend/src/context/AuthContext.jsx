import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('aurastore_session_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error restoring session user', e);
      }
    }
  }, []);

  const loginUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('aurastore_session_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('aurastore_session_user');
  };

  useEffect(() => {
    const handleUnauthorized = (e) => {
      logoutUser();
      setIsAuthModalOpen(true);
      console.warn('[AuthContext] Intercepted 401 Unauthorized: logging out user.', e.detail);
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
