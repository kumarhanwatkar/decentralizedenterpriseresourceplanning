# Decentralized ERP Backend - Complete Setup Guide

## 📋 Table of Contents
1. [Project Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Installation & Setup](#installation--setup)
7. [Environment Variables](#environment-variables)

---

## Overview

This backend powers the Decentralized ERP system with:
- **Real-time payroll streaming** logic
- **Wallet-based authentication** (MetaMask)
- **JWT token management**
- **MongoDB data persistence**
- **REST API** for frontend communication

---

## Tech Stack

### Core Framework
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.x** - Web framework
- **TypeScript** - Type safety (optional but recommended)

### Database
- **MongoDB 6.x** - Document database
- **Mongoose 7.x** - MongoDB ODM with schema validation

### Authentication
- **jsonwebtoken (JWT)** - Token-based auth
- **ethers.js** - Wallet verification
- **bcryptjs** - Password hashing (future use)

### Development Tools
- **Nodemon** - Auto-reload during development
- **Dotenv** - Environment variable management
- **Cors** - Cross-origin requests
- **Express-validator** - Input validation
- **Morgan** - HTTP request logging

### Testing & Deployment
- **Jest** - Unit testing framework
- **Supertest** - HTTP assertion library
- **PM2** - Production process manager

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # MongoDB connection
│   │   ├── environment.ts        # Environment variables
│   │   └── constants.ts          # App constants
│   │
│   ├── models/
│   │   ├── User.ts              # User/Employee model
│   │   ├── Employee.ts          # Employee details
│   │   ├── Resource.ts          # Resource management
│   │   ├── Transaction.ts       # Transaction ledger
│   │   ├── Payroll.ts           # Payroll streaming data
│   │   ├── AIConfig.ts          # AI dashboard config
│   │   └── Settings.ts          # Organization settings
│   │
│   ├── middleware/
│   │   ├── authentication.ts    # JWT verification
│   │   ├── authorization.ts     # Role-based access
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── validation.ts        # Input validation
│   │   └── logging.ts           # Request logging
│   │
│   ├── controllers/
│   │   ├── authController.ts    # Login/signup logic
│   │   ├── employeeController.ts
│   │   ├── payrollController.ts
│   │   ├── transactionController.ts
│   │   ├── resourceController.ts
│   │   ├── aiConfigController.ts
│   │   └── settingsController.ts
│   │
│   ├── routes/
│   │   ├── auth.ts              # /api/auth routes
│   │   ├── employees.ts         # /api/employees routes
│   │   ├── payroll.ts           # /api/payroll routes
│   │   ├── transactions.ts      # /api/transactions routes
│   │   ├── resources.ts         # /api/resources routes
│   │   ├── aiConfig.ts          # /api/ai-config routes
│   │   ├── settings.ts          # /api/settings routes
│   │   └── index.ts             # Combine all routes
│   │
│   ├── services/
│   │   ├── payrollService.ts    # Payroll logic
│   │   ├── walletService.ts     # Wallet verification
│   │   ├── transactionService.ts
│   │   ├── aiService.ts         # AI integration
│   │   └── emailService.ts      # Email notifications
│   │
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── validators.ts        # Custom validators
│   │   ├── helpers.ts           # Helper functions
│   │   └── errors.ts            # Custom error classes
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   │
│   └── app.ts                   # Express app setup
│
├── tests/
│   ├── auth.test.ts
│   ├── payroll.test.ts
│   └── transactions.test.ts
│
├── .env.example                 # Environment template
├── .env.local                   # Local environment (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── jest.config.js
├── docker-compose.yml           # MongoDB + other services
├── docker.env                   # Docker environment
└── README.md
```

---

## Database Schema

### 1. User Schema (Authentication)
```typescript
{
  _id: ObjectId
  walletAddress: string (unique, indexed)
  email: string
  name: string
  role: "admin" | "employee" | "manager"
  status: "active" | "inactive" | "paused"
  
  // Authentication
  lastLogin: Date
  loginCount: number
  
  // Profile
  department: string
  joinDate: Date
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
```

### 2. Employee Schema
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  walletAddress: string
  
  // Employment Info
  employeeId: string (unique, e.g., "EMP001")
  firstName: string
  lastName: string
  email: string
  department: string
  role: string
  
  // Compensation
  hourlyRate: number
  baseSalary: number
  payrollCycle: "weekly" | "biweekly" | "monthly"
  
  // Wallet Setup
  coldWallet: string (15% liquid funds)
  hotWallet: string (85% locked funds)
  walletType: "metamask" | "binance" | "other"
  
  // Status
  status: "active" | "on_leave" | "paused" | "terminated"
  startDate: Date
  endDate: Date (if terminated)
  
  // Earnings Tracking
  totalEarned: number
  totalPaid: number
  pendingAmount: number
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### 3. Payroll Schema (Real-time Streaming)
```typescript
{
  _id: ObjectId
  employeeId: ObjectId (ref: Employee)
  
  // Current Cycle
  cycleId: string
  cycleStartDate: Date
  cycleEndDate: Date
  hourlyRate: number
  
  // Streaming Data
  totalAccrued: number
  liquidAmount: number (15%)
  lockedAmount: number (85%)
  
  // Payments
  lastStreamedAt: Date
  lastPaymentAt: Date
  paymentFrequency: "hourly" | "daily" | "weekly"
  
  // Status
  isStreaming: boolean
  isPaused: boolean
  
  createdAt: Date
  updatedAt: Date
}
```

### 4. Transaction Schema (Blockchain Ledger)
```typescript
{
  _id: ObjectId
  
  // Transaction Info
  txHash: string (unique, blockchain hash)
  blockNumber: number
  timestamp: Date
  
  // Type
  type: "payroll" | "yield" | "transfer" | "fee"
  
  // Parties
  fromEmployeeId: ObjectId (ref: Employee, optional)
  toEmployeeId: ObjectId (ref: Employee, optional)
  fromAddress: string
  toAddress: string
  
  // Amount
  amount: number
  token: "USDT" | "BUSD" | "USDC" | "BNB"
  
  // Yield (if applicable)
  yieldGenerated: number
  yieldPercentage: number
  lockPeriod: number (days)
  
  // Status
  status: "confirmed" | "pending" | "failed"
  confirmations: number
  gasUsed: number
  
  // Metadata
  description: string
  metadata: object
  
  createdAt: Date
  updatedAt: Date
}
```

### 5. Resource Schema
```typescript
{
  _id: ObjectId
  
  // Resource Info
  resourceId: string (unique, e.g., "RES001")
  name: string
  type: "server" | "machine" | "equipment"
  serialNumber: string
  
  // Department & Location
  department: string
  location: string
  
  // Status & Performance
  status: "operational" | "maintenance" | "offline"
  utilization: number (0-100)
  efficiency: number (0-100)
  
  // Maintenance
  lastMaintenance: Date
  nextMaintenanceScheduled: Date
  maintenanceHistory: [{
    date: Date
    type: string
    duration: number
    technician: string
  }]
  
  // Specifications
  specifications: object
  purchaseDate: Date
  warranty: {
    expiryDate: Date
    provider: string
  }
  
  // Costs
  purchasePrice: number
  maintenanceCost: number
  
  createdAt: Date
  updatedAt: Date
}
```

### 6. AI Config Schema
```typescript
{
  _id: ObjectId
  organizationId: string
  adminId: ObjectId (ref: User)
  
  // Organization Description
  organizationName: string
  description: string
  rawInput: string
  
  // Generated Widgets
  widgets: [{
    id: string
    type: "stat_card" | "pie_chart" | "bar_chart" | "line_chart" | "table" | "alert"
    title: string
    position: number
    size: "small" | "medium" | "large"
    dataSource: string
    configuration: object
  }]
  
  // Layout
  layout: "grid" | "flex"
  gridColumns: number
  
  // Versions
  version: number
  previousVersions: [ObjectId]
  
  // Status
  isActive: boolean
  isPublished: boolean
  
  createdAt: Date
  updatedAt: Date
}
```

### 7. Settings Schema
```typescript
{
  _id: ObjectId
  organizationId: string
  
  // Company Info
  companyName: string
  companyEmail: string
  companyPhone: string
  companyLogo: string (URL)
  
  // Payroll Settings
  payrollCycle: "weekly" | "biweekly" | "monthly"
  payrollDay: number (1-31)
  yieldDistributionPercent: number (0-100)
  liquidPercentage: number (default: 15)
  
  // Blockchain Settings
  blockchainNetwork: "bsc_mainnet" | "bsc_testnet"
  smartContractAddress: string
  gasPrice: string
  
  // Notifications
  notificationSettings: {
    emailPayroll: boolean
    emailYield: boolean
    emailSystem: boolean
    smsPayroll: boolean
  }
  
  // Security
  twoFactorEnabled: boolean
  ipWhitelist: [string]
  
  // API Settings
  apiKeysEnabled: boolean
  rateLimit: number
  
  createdAt: Date
  updatedAt: Date
}
```

### 8. Organization Schema (Master record)
```typescript
{
  _id: ObjectId
  
  // Basic Info
  name: string
  email: string
  phone: string
  
  // Admin
  adminId: ObjectId (ref: User)
  
  // Subscription
  plan: "free" | "starter" | "professional" | "enterprise"
  employees: number
  resources: number
  
  // Status
  status: "active" | "suspended" | "cancelled"
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)

```
POST   /api/auth/wallet-login        → Login with wallet address
POST   /api/auth/verify-message      → Verify signed message
POST   /api/auth/refresh-token       → Get new JWT token
POST   /api/auth/logout              → Logout user
GET    /api/auth/me                  → Get current user profile
POST   /api/auth/wallet-connect      → Connect new wallet
```

### Employee Routes (`/api/employees`)

```
GET    /api/employees                → List all employees
POST   /api/employees                → Create new employee
GET    /api/employees/:id            → Get employee details
PUT    /api/employees/:id            → Update employee
DELETE /api/employees/:id            → Delete employee
PATCH  /api/employees/:id/status     → Update employee status
GET    /api/employees/:id/earnings   → Get employee earnings
GET    /api/employees/search         → Search employees
```

### Payroll Routes (`/api/payroll`)

```
GET    /api/payroll/streams          → List active payroll streams
POST   /api/payroll/start-stream     → Start payroll for employee
PUT    /api/payroll/:id              → Update payroll config
PATCH  /api/payroll/:id/pause        → Pause payroll stream
PATCH  /api/payroll/:id/resume       → Resume payroll stream
GET    /api/payroll/:id/history      → Get payroll history
POST   /api/payroll/calculate        → Calculate payroll (admin)
GET    /api/payroll/batch-report     → Get batch payroll report
```

### Transaction Routes (`/api/transactions`)

```
GET    /api/transactions             → List all transactions
POST   /api/transactions             → Create transaction
GET    /api/transactions/:id         → Get transaction details
GET    /api/transactions/search      → Search transactions
GET    /api/transactions/employee/:id → Get employee transactions
GET    /api/transactions/analytics   → Transaction analytics
PATCH  /api/transactions/:id/resend  → Resend failed transaction
```

### Resource Routes (`/api/resources`)

```
GET    /api/resources                → List all resources
POST   /api/resources                → Create resource
GET    /api/resources/:id            → Get resource details
PUT    /api/resources/:id            → Update resource
DELETE /api/resources/:id            → Delete resource
PATCH  /api/resources/:id/status     → Update resource status
POST   /api/resources/:id/maintenance → Schedule maintenance
GET    /api/resources/analytics      → Resource analytics
```

### AI Config Routes (`/api/ai-config`)

```
POST   /api/ai-config/generate       → Generate dashboard from description
GET    /api/ai-config                → Get current config
PUT    /api/ai-config                → Update config
POST   /api/ai-config/publish        → Publish configuration
GET    /api/ai-config/versions       → Get version history
POST   /api/ai-config/rollback       → Rollback to previous version
```

### Settings Routes (`/api/settings`)

```
GET    /api/settings                 → Get organization settings
PUT    /api/settings                 → Update settings
GET    /api/settings/payroll         → Get payroll settings
PUT    /api/settings/payroll         → Update payroll settings
GET    /api/settings/notifications   → Get notification settings
PUT    /api/settings/notifications   → Update notification settings
```

### Dashboard Routes (`/api/dashboard`)

```
GET    /api/dashboard/admin          → Admin dashboard data
GET    /api/dashboard/employee       → Employee dashboard data
GET    /api/dashboard/stats          → Overall statistics
```

---

## Installation & Setup

### 1. Prerequisites
```bash
- Node.js 18+
- MongoDB 6+ (local or cloud)
- Npm or Yarn
```

### 2. Clone & Install
```bash
cd backend
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 4. Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/erp-db
MONGODB_TEST_URI=mongodb://localhost:27017/erp-test

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRE=30d

# Blockchain
BLOCKCHAIN_NETWORK=bsc_testnet
BLOCKCHAIN_RPC_URL=https://data-seed-prebsc-1-b.binance.org:8545
SMART_CONTRACT_ADDRESS=0x...

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI Service (if using)
OPENAI_API_KEY=sk-...

# CORS
FRONTEND_URL=http://localhost:8080
```

### 5. Start Development
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## Type Safety with TypeScript

All endpoints, models, and responses use TypeScript interfaces for type safety:

```typescript
// Request type
interface LoginRequest {
  walletAddress: string;
  signedMessage: string;
  timestamp: number;
}

// Response type
interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    walletAddress: string;
    role: UserRole;
  };
}

// Model type
interface IEmployee extends Document {
  userId: ObjectId;
  hourlyRate: number;
  status: EmployeeStatus;
  // ... other fields
}
```

---

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update MongoDB to production URI
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS on frontend
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable request logging
- [ ] Configure error tracking (Sentry)
- [ ] Set up monitoring (New Relic, DataDog)
- [ ] Enable database backups
- [ ] Configure email service
- [ ] Test all API endpoints
- [ ] Load testing
- [ ] Security audit

