import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
  status: 'active' | 'paused' | 'inactive';
  hourlyRate: number;
  totalEarned: number;
  walletAddress: string;
  joinDate: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'machine' | 'server' | 'equipment';
  department: string;
  status: 'operational' | 'maintenance' | 'offline';
  utilization: number;
  efficiency: number;
  lastMaintenance: string;
  location: string;
}

export interface Transaction {
  id: string;
  txHash: string;
  type: 'payroll' | 'yield' | 'transfer' | 'fee';
  from: string;
  to: string;
  amount: number;
  token: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
}

export interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  payrollCycle: 'weekly' | 'biweekly' | 'monthly';
  yieldDistributionPercent: number;
  notificationEmail: boolean;
  notificationPayroll: boolean;
  notificationYield: boolean;
}

interface OrganizationContextType {
  employees: Employee[];
  resources: Resource[];
  transactions: Transaction[];
  settings: Settings;
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    totalPayrollMonthly: number;
    totalYieldGenerated: number;
    activeResources: number;
  };
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  addTransaction: (tx: Transaction) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  toggleEmployeeStatus: (id: string) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
};

// Initial mock data - Enhanced with comprehensive employee data
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    department: 'Engineering',
    role: 'Senior Developer',
    email: 'alex@techforge.com',
    status: 'active',
    hourlyRate: 55,
    totalEarned: 23450.75,
    walletAddress: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    department: 'Product',
    role: 'Product Manager',
    email: 'sarah@techforge.com',
    status: 'active',
    hourlyRate: 58,
    totalEarned: 25680.50,
    walletAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
    joinDate: '2022-03-22',
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    department: 'Engineering',
    role: 'DevOps Engineer',
    email: 'marcus@techforge.com',
    status: 'active',
    hourlyRate: 52,
    totalEarned: 22340.25,
    walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    joinDate: '2023-06-10',
  },
  {
    id: '4',
    name: 'Emily Watson',
    department: 'Design',
    role: 'UX/UI Designer',
    email: 'emily@techforge.com',
    status: 'active',
    hourlyRate: 48,
    totalEarned: 21200.90,
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    joinDate: '2023-02-01',
  },
  {
    id: '5',
    name: 'James Miller',
    department: 'Operations',
    role: 'Operations Lead',
    email: 'james@techforge.com',
    status: 'active',
    hourlyRate: 50,
    totalEarned: 19875.40,
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    joinDate: '2022-11-05',
  },
  {
    id: '6',
    name: 'Priya Sharma',
    department: 'Engineering',
    role: 'Full Stack Developer',
    email: 'priya@techforge.com',
    status: 'active',
    hourlyRate: 51,
    totalEarned: 20450.60,
    walletAddress: '0xcccccccccccccccccccccccccccccccccccccccc',
    joinDate: '2023-04-20',
  },
  {
    id: '7',
    name: 'David Lee',
    department: 'Finance',
    role: 'CFO',
    email: 'david@techforge.com',
    status: 'active',
    hourlyRate: 65,
    totalEarned: 28900.35,
    walletAddress: '0xdddddddddddddddddddddddddddddddddddddddd',
    joinDate: '2022-05-10',
  },
  {
    id: '8',
    name: 'Jessica Brown',
    department: 'Marketing',
    role: 'Marketing Manager',
    email: 'jessica@techforge.com',
    status: 'active',
    hourlyRate: 45,
    totalEarned: 18920.75,
    walletAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    joinDate: '2023-08-15',
  },
  {
    id: '9',
    name: 'Thomas Wright',
    department: 'Operations',
    role: 'SQL Admin',
    email: 'thomas@techforge.com',
    status: 'paused',
    hourlyRate: 49,
    totalEarned: 17650.20,
    walletAddress: '0xffffffffffffffffffffffffffffffffffffffff',
    joinDate: '2022-12-01',
  },
  {
    id: '10',
    name: 'Olivia Martinez',
    department: 'Product',
    role: 'Product Analyst',
    email: 'olivia@techforge.com',
    status: 'active',
    hourlyRate: 46,
    totalEarned: 19340.85,
    walletAddress: '0x1111111111111111111111111111111111111111',
    joinDate: '2023-03-08',
  },
];


const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'r1',
    name: 'Server Node 1',
    type: 'server',
    department: 'Infrastructure',
    status: 'operational',
    utilization: 78,
    efficiency: 94,
    lastMaintenance: '2025-01-15',
    location: 'Data Center A',
  },
  {
    id: 'r2',
    name: 'GPU Cluster',
    type: 'machine',
    department: 'Engineering',
    status: 'operational',
    utilization: 92,
    efficiency: 89,
    lastMaintenance: '2025-01-10',
    location: 'Lab 2',
  },
  {
    id: 'r3',
    name: 'Load Balancer',
    type: 'equipment',
    department: 'Infrastructure',
    status: 'operational',
    utilization: 45,
    efficiency: 98,
    lastMaintenance: '2025-01-20',
    location: 'Data Center B',
  },
  {
    id: 'r4',
    name: 'Storage Array',
    type: 'server',
    department: 'Infrastructure',
    status: 'maintenance',
    utilization: 0,
    efficiency: 0,
    lastMaintenance: '2025-02-04',
    location: 'Data Center A',
  },
  {
    id: 'r5',
    name: 'Development Workstation',
    type: 'machine',
    department: 'Engineering',
    status: 'operational',
    utilization: 65,
    efficiency: 91,
    lastMaintenance: '2024-12-28',
    location: 'Office 3',
  },
  {
    id: 'r6',
    name: 'Database Server',
    type: 'server',
    department: 'Infrastructure',
    status: 'operational',
    utilization: 85,
    efficiency: 96,
    lastMaintenance: '2025-01-28',
    location: 'Data Center A',
  },
  {
    id: 'r7',
    name: 'CNC Machine - 101',
    type: 'machine',
    department: 'Manufacturing',
    status: 'operational',
    utilization: 88,
    efficiency: 92,
    lastMaintenance: '2025-02-01',
    location: 'Production Floor',
  },
  {
    id: 'r8',
    name: 'Backup Power Unit',
    type: 'equipment',
    department: 'Infrastructure',
    status: 'operational',
    utilization: 12,
    efficiency: 99,
    lastMaintenance: '2025-02-03',
    location: 'Data Center B',
  },
  {
    id: 'r9',
    name: 'Network Router',
    type: 'equipment',
    department: 'Infrastructure',
    status: 'operational',
    utilization: 72,
    efficiency: 97,
    lastMaintenance: '2025-01-25',
    location: 'Main Office',
  },
  {
    id: 'r10',
    name: 'Testing Lab Setup',
    type: 'machine',
    department: 'Engineering',
    status: 'operational',
    utilization: 55,
    efficiency: 88,
    lastMaintenance: '2025-02-02',
    location: 'Lab 1',
  },
];


const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    amount: 55.00,
    token: 'USDT',
    timestamp: '2025-02-04 15:45:00',
    status: 'confirmed',
    blockNumber: 45678901,
  },
  {
    id: 'tx2',
    txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    type: 'yield',
    from: 'Hot Wallet',
    to: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    amount: 342.80,
    token: 'USDT',
    timestamp: '2025-02-03 09:15:00',
    status: 'confirmed',
    blockNumber: 45678850,
  },
  {
    id: 'tx3',
    txHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    type: 'transfer',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: 'Partner Org Wallet',
    amount: 5000.00,
    token: 'BUSD',
    timestamp: '2025-02-02 08:00:00',
    status: 'confirmed',
    blockNumber: 45678700,
  },
  {
    id: 'tx4',
    txHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
    amount: 58.00,
    token: 'USDT',
    timestamp: '2025-02-04 15:30:00',
    status: 'confirmed',
    blockNumber: 45678650,
  },
  {
    id: 'tx5',
    txHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    amount: 52.00,
    token: 'USDT',
    timestamp: '2025-02-04 15:20:00',
    status: 'confirmed',
    blockNumber: 45678600,
  },
  {
    id: 'tx6',
    txHash: '0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    type: 'yield',
    from: 'Hot Wallet',
    to: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
    amount: 410.50,
    token: 'USDT',
    timestamp: '2025-02-03 14:00:00',
    status: 'confirmed',
    blockNumber: 45678550,
  },
  {
    id: 'tx7',
    txHash: '0x78901abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    amount: 48.00,
    token: 'USDT',
    timestamp: '2025-02-04 15:10:00',
    status: 'confirmed',
    blockNumber: 45678500,
  },
  {
    id: 'tx8',
    txHash: '0x89012abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    type: 'fee',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: 'Network Fee',
    amount: 2.50,
    token: 'BNB',
    timestamp: '2025-02-04 14:45:00',
    status: 'confirmed',
    blockNumber: 45678450,
  },
  {
    id: 'tx9',
    txHash: '0x9a123bcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
    type: 'transfer',
    from: 'Organization Treasury',
    to: 'Vendor Account',
    amount: 15000.00,
    token: 'USDT',
    timestamp: '2025-02-01 10:00:00',
    status: 'confirmed',
    blockNumber: 45678400,
  },
  {
    id: 'tx10',
    txHash: '0xab234cdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    type: 'yield',
    from: 'Hot Wallet',
    to: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    amount: 285.40,
    token: 'USDT',
    timestamp: '2025-02-03 11:30:00',
    status: 'confirmed',
    blockNumber: 45678350,
  },
  {
    id: 'tx11',
    txHash: '0xbc345def1234567890abcdef1234567890abcdef1234567890abcdef123456789',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    amount: 50.00,
    token: 'USDT',
    timestamp: '2025-02-04 15:00:00',
    status: 'confirmed',
    blockNumber: 45678300,
  },
  {
    id: 'tx12',
    txHash: '0xcd456ef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'yield',
    from: 'Hot Wallet',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    amount: 318.90,
    token: 'USDT',
    timestamp: '2025-02-03 09:00:00',
    status: 'confirmed',
    blockNumber: 45678250,
  },
  {
    id: 'tx13',
    txHash: '0xde567f12345678901abcdef1234567890abcdef1234567890abcdef12345678901',
    type: 'transfer',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: 'Reserve Fund',
    amount: 25000.00,
    token: 'BUSD',
    timestamp: '2025-02-04 08:30:00',
    status: 'pending',
    blockNumber: 45678200,
  },
  {
    id: 'tx14',
    txHash: '0xef678012345678901abcdef1234567890abcdef1234567890abcdef123456789012',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0xcccccccccccccccccccccccccccccccccccccccc',
    amount: 51.00,
    token: 'USDT',
    timestamp: '2025-02-04 14:50:00',
    status: 'confirmed',
    blockNumber: 45678150,
  },
  {
    id: 'tx15',
    txHash: '0xf9789123456789012abcdef1234567890abcdef1234567890abcdef1234567890123',
    type: 'yield',
    from: 'Hot Wallet',
    to: '0xcccccccccccccccccccccccccccccccccccccccc',
    amount: 355.20,
    token: 'USDT',
    timestamp: '2025-02-03 13:15:00',
    status: 'confirmed',
    blockNumber: 45678100,
  },
];

const INITIAL_SETTINGS: Settings = {
  companyName: 'TechForge Industries',
  companyEmail: 'admin@techforge.com',
  companyPhone: '+1 (555) 123-4567',
  payrollCycle: 'weekly',
  yieldDistributionPercent: 85,
  notificationEmail: true,
  notificationPayroll: true,
  notificationYield: true,
};

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  // Real-time payroll streaming - updates every second
  useEffect(() => {
    const payrollInterval = setInterval(() => {
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.status === 'active'
            ? { ...emp, totalEarned: emp.totalEarned + emp.hourlyRate / 3600 }
            : emp
        )
      );
    }, 1000);

    return () => clearInterval(payrollInterval);
  }, []);

  // Real-time resource utilization updates - updates every 5 seconds
  useEffect(() => {
    const resourceInterval = setInterval(() => {
      setResources((prevResources) =>
        prevResources.map((res) => {
          if (res.status === 'operational') {
            // Random fluctuation between -5 and +5 percent
            const fluctuation = (Math.random() - 0.5) * 10;
            const newUtilization = Math.max(0, Math.min(100, res.utilization + fluctuation));
            return { ...res, utilization: Math.round(newUtilization * 10) / 10 };
          }
          return res;
        })
      );
    }, 5000);

    return () => clearInterval(resourceInterval);
  }, []);

  // Add occasional new transactions - every 10 seconds
  useEffect(() => {
    const transactionInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to add transaction
        const txTypes: ('payroll' | 'yield' | 'transfer' | 'fee')[] = ['payroll', 'yield', 'fee'];
        const randomType = txTypes[Math.floor(Math.random() * txTypes.length)];
        const amounts: { [key in typeof randomType]: number } = {
          payroll: Math.random() * 60 + 40, // 40-100
          yield: Math.random() * 400 + 200, // 200-600
          fee: Math.random() * 5 + 1, // 1-6
        };

        const newTransaction: Transaction = {
          id: `tx${Date.now()}`,
          txHash: `0x${Math.random().toString(16).slice(2)}`,
          type: randomType,
          from: randomType === 'fee' ? 'Network' : '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
          to: randomType === 'yield' ? employees[Math.floor(Math.random() * employees.length)].walletAddress : 'Wallet',
          amount: Math.round(amounts[randomType] * 100) / 100,
          token: randomType === 'fee' ? 'BNB' : 'USDT',
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(Math.random() * 1000000000),
        };
        
        setTransactions((prev) => [newTransaction, ...prev].slice(0, 20)); // Keep last 20 transactions
      }
    }, 10000);

    return () => clearInterval(transactionInterval);
  }, [employees]);

  // Calculate stats
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    totalPayrollMonthly: employees.reduce((sum, e) => sum + e.hourlyRate * 160, 0),
    totalYieldGenerated: transactions
      .filter((t) => t.type === 'yield' && t.status === 'confirmed')
      .reduce((sum, t) => sum + t.amount, 0),
    activeResources: resources.filter((r) => r.status === 'operational').length,
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources((prev) =>
      prev.map((res) => (res.id === id ? { ...res, ...updates } : res))
    );
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: emp.status === 'active' ? 'paused' : 'active',
            }
          : emp
      )
    );
  };

  const value: OrganizationContextType = {
    employees,
    resources,
    transactions,
    settings,
    stats,
    updateEmployee,
    updateResource,
    addTransaction,
    updateSettings,
    toggleEmployeeStatus,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
