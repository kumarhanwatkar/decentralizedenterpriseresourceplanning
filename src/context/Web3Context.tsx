import { createContext, useContext, useState } from 'react';

const Web3Context = createContext<any>(null);

export const Web3Provider = ({ children }: any) => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    // Mock wallet connection
    const mockAccount = '0x' + Math.random().toString(16).substring(2, 42);
    setAccount(mockAccount);
    setConnected(true);
    localStorage.setItem('walletAddress', mockAccount);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setConnected(false);
    localStorage.removeItem('walletAddress');
  };

  return (
    <Web3Context.Provider value={{ connected, account, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};
