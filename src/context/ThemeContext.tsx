import React, { createContext, useContext, ReactNode } from 'react';

export const ThemeContext = createContext<any>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
