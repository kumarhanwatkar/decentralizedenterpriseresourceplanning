import React, { createContext, useContext, ReactNode } from 'react';

export const Web3Context = createContext<any>(null);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Web3Context.Provider value={{}}>{children}</Web3Context.Provider>
);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};
