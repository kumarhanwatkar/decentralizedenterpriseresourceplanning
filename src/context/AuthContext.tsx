import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'employee' | null;

interface User {
  id: string;
  walletAddress: string;
  role: UserRole;
  name: string;
  email: string;
  organizationId?: string;
  organizationName?: string;
  department?: string;
  hourlyRate?: number;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (walletAddress: string, role: UserRole, userData?: Partial<User>) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for presentation
const demoUsers: Record<string, User> = {
  admin: {
    id: '1',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    role: 'admin',
    name: 'Ayush Bhujade',
    email: 'admin@derp.io',
    organizationId: 'org-001',
    organizationName: 'TechForge Industries',
  },
  employee: {
    id: '2',
    walletAddress: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    role: 'employee',
    name: 'Kumar Hanwatkar',
    email: 'kumar@derp.io',
    organizationId: 'org-001',
    organizationName: 'TechForge Industries',
    department: 'Engineering',
    hourlyRate: 25,
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (walletAddress: string, role: UserRole, userData?: Partial<User>) => {
    const demoUser = role === 'admin' ? demoUsers.admin : demoUsers.employee;
    setUser({
      ...demoUser,
      ...userData,
      walletAddress,
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
