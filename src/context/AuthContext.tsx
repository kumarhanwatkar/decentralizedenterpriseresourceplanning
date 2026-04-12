import React, { createContext, useContext, ReactNode } from 'react';

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
