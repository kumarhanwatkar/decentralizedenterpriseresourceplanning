// User & Authentication Types
export type UserRole = 'admin' | 'employee' | 'manager';
export type UserStatus = 'active' | 'inactive' | 'paused';

export interface IUser {
  _id: string;
  walletAddress: string;
  email?: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: Date;
  loginCount: number;
  department?: string;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// Employee Types
export type EmployeeStatus = 'active' | 'on_leave' | 'paused' | 'terminated';

export interface IEmployee {
  _id: string;
  userId: string;
  walletAddress: string;
  employeeId: string; // Unique ID like EMP001
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  hourlyRate: number;
  baseSalary: number;
  payrollCycle: 'weekly' | 'biweekly' | 'monthly';
  coldWallet: string;
  hotWallet: string;
  walletType: 'metamask' | 'binance' | 'other';
  status: EmployeeStatus;
  startDate: Date;
  endDate?: Date;
  totalEarned: number;
  totalAccrued: number; // Real-time earnings accrued since last stream
  liquidAmount: number; // 15% of accrued - immediately available earnings
  lockedAmount: number; // 85% of accrued - locked until vesting
  totalPaid: number;
  pendingAmount: number;
  lastStreamedAt: Date; // When earnings were last calculated
  isStreamingActive: boolean; // Whether payroll streaming is active
  createdAt: Date;
  updatedAt: Date;
}

// Payroll Types
export interface IPayroll {
  _id: string;
  employeeId: string;
  cycleId: string;
  cycleStartDate: Date;
  cycleEndDate: Date;
  hourlyRate: number;
  totalAccrued: number;
  liquidAmount: number;
  lockedAmount: number;
  lastStreamedAt?: Date;
  lastPaymentAt?: Date;
  paymentFrequency: 'hourly' | 'daily' | 'weekly';
  isStreaming: boolean;
  isPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export type TransactionType = 'payroll' | 'yield' | 'transfer' | 'fee';
export type TransactionStatus = 'confirmed' | 'pending' | 'failed';

export interface ITransaction {
  _id: string;
  txHash: string;
  blockNumber: number;
  timestamp: Date;
  type: TransactionType;
  fromEmployeeId?: string;
  toEmployeeId?: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  token: 'USDT' | 'BUSD' | 'USDC' | 'BNB';
  yieldGenerated?: number;
  yieldPercentage?: number;
  lockPeriod?: number;
  status: TransactionStatus;
  confirmations: number;
  gasUsed: number;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Resource Types
export type ResourceType = 'server' | 'machine' | 'equipment';
export type ResourceStatus = 'operational' | 'maintenance' | 'offline';

export interface IResource {
  _id: string;
  resourceId: string;
  name: string;
  type: ResourceType;
  serialNumber?: string;
  department: string;
  location: string;
  status: ResourceStatus;
  utilization: number;
  efficiency: number;
  lastMaintenance?: Date;
  nextMaintenanceScheduled?: Date;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  purchasePrice?: number;
  maintenanceCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

// AI Config Types
export type WidgetType = 'stat_card' | 'pie_chart' | 'bar_chart' | 'line_chart' | 'table' | 'alert';
export type WidgetSize = 'small' | 'medium' | 'large';

export interface IWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: number;
  size: WidgetSize;
  dataSource: string;
  configuration: Record<string, any>;
}

export interface IAIConfig {
  _id: string;
  organizationId: string;
  adminId: string;
  organizationName: string;
  description: string;
  rawInput: string;
  widgets: IWidget[];
  layout: 'grid' | 'flex';
  gridColumns: number;
  version: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Settings Types
export interface ISettings {
  _id: string;
  organizationId: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyLogo?: string;
  payrollCycle: 'weekly' | 'biweekly' | 'monthly';
  payrollDay: number;
  yieldDistributionPercent: number;
  liquidPercentage: number;
  blockchainNetwork: 'bsc_mainnet' | 'bsc_testnet';
  smartContractAddress: string;
  notificationSettings: {
    emailPayroll: boolean;
    emailYield: boolean;
    emailSystem: boolean;
    smsPayroll: boolean;
  };
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Organization Types
export type OrganizationPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type OrganizationStatus = 'active' | 'suspended' | 'cancelled';

export interface IOrganization {
  _id: string;
  name: string;
  email: string;
  phone: string;
  adminId: string;
  plan: OrganizationPlan;
  employeeCount: number;
  resourceCount: number;
  status: OrganizationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response Types
export interface LoginRequest {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: number;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    walletAddress: string;
    name: string;
    role: UserRole;
    organizationId?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Authenticated Request Type
export interface AuthenticatedRequest {
  userId: string;
  userRole: UserRole;
  walletAddress: string;
  organizationId?: string;
}

// Payroll Stream Data
export interface PayrollStreamData {
  employeeId: string;
  hourlyRate: number;
  liquidPercentage: number;
  lockedPercentage: number;
  totalAccrued: number;
  lastStreamedAt: Date;
}

// Error Type
export class CustomError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'CustomError';
  }
}
