# Frontend-to-Backend Integration Guide

This guide explains how to connect your React frontend to the Node.js backend APIs.

## 🔗 Connection Overview

Your frontend (React on port 8080) will communicate with your backend (Express on port 5000) via HTTP REST APIs.

```
Frontend (React)          Backend (Express)         Database (MongoDB)
localhost:8080    ←→      localhost:5000     ←→      localhost:27017
```

## 🚀 Setup Steps

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

Wait for message: `✅ Server running on http://localhost:5000`

### 2. Configure Frontend API Base URL

In your React frontend, create/update a configuration file:

**File: `src/config/api.ts`**
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  getAuthToken: () => localStorage.getItem('authToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
};

export const API_ENDPOINTS = {
  AUTH: {
    WALLET_LOGIN: '/auth/wallet-login',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    GET: (id) => `/employees/${id}`,
    UPDATE: (id) => `/employees/${id}`,
    UPDATE_STATUS: (id) => `/employees/${id}/status`,
    DELETE: (id) => `/employees/${id}`,
    SEARCH: '/employees/search',
  },
  PAYROLL: {
    LIST: '/payroll',
    GET: (id) => `/payroll/${id}`,
  },
  TRANSACTIONS: {
    LIST: '/transactions',
  },
};
```

### 3. Create API Service Layer

**File: `src/services/api.ts`**
```typescript
import { apiClient, API_ENDPOINTS } from '../config/api';

class APIService {
  private baseURL = apiClient.baseURL;

  private getHeaders() {
    const token = apiClient.getAuthToken();
    return {
      ...apiClient.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    data?: unknown,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
      ...(data && { body: JSON.stringify(data) }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Authentication
  async walletLogin(walletAddress: string, signature: string) {
    return this.request('/auth/wallet-login', 'POST', {
      walletAddress,
      signature,
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh-token', 'POST');
  }

  async getCurrentUser() {
    return this.request('/auth/me', 'GET');
  }

  // Employees
  async getEmployees(page = 1, pageSize = 10) {
    return this.request(
      `${API_ENDPOINTS.EMPLOYEES.LIST}?page=${page}&pageSize=${pageSize}`,
      'GET',
    );
  }

  async getEmployee(id: string) {
    return this.request(API_ENDPOINTS.EMPLOYEES.GET(id), 'GET');
  }

  async searchEmployees(query: string) {
    return this.request(
      `${API_ENDPOINTS.EMPLOYEES.SEARCH}?q=${query}`,
      'GET',
    );
  }

  async createEmployee(data: unknown) {
    return this.request(API_ENDPOINTS.EMPLOYEES.CREATE, 'POST', data);
  }

  async updateEmployee(id: string, data: unknown) {
    return this.request(API_ENDPOINTS.EMPLOYEES.UPDATE(id), 'PUT', data);
  }

  async updateEmployeeStatus(id: string, status: string) {
    return this.request(API_ENDPOINTS.EMPLOYEES.UPDATE_STATUS(id), 'PATCH', {
      status,
    });
  }

  async deleteEmployee(id: string) {
    return this.request(API_ENDPOINTS.EMPLOYEES.DELETE(id), 'DELETE');
  }
}

export const api = new APIService();
```

### 4. Update Web3Context for API Integration

**Update `src/context/Web3Context.tsx`**
```typescript
import { createContext, useContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { api } from '../services/api';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Connect to MetaMask
  const connect = useCallback(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  // Login with wallet signature
  const login = useCallback(async () => {
    try {
      if (!account) throw new Error('Wallet not connected');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get message to sign from backend
      const message = `Sign this message to login to ERP\nTimestamp: ${Date.now()}`;

      // Sign message
      const signature = await signer.signMessage(message);

      // Send to backend for verification
      const response = await api.walletLogin(account, signature);

      // Store tokens
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      setIsAuthenticated(true);
      return response.data.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [account]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.request('/auth/logout', 'POST');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setAccount(null);
      setIsConnected(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAccount(null);
    setIsConnected(false);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        connect,
        disconnect,
        login,
        logout,
        isAuthenticated,
      }}
    >
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
```

### 5. Update Environment Configuration

**File: `.env.development`** (in frontend root)
```env
VITE_API_URL=http://localhost:5000/api
```

**Update `src/config/api.ts`**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 6. Update Dashboard Components

**Example: Update EmployeeDashboard to use API**

```typescript
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.getEmployees(1, 10);
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? <p>Loading...</p> : null}
      {/* Display employees */}
    </div>
  );
};
```

## 🔄 API Communication Flow

### Authentication Flow

```
1. User clicks "Connect Wallet" 
   → Calls Web3Context.connect()
   → MetaMask popup appears
   → User approves connection
   → Account stored in context

2. User clicks "Login"
   → Calls Web3Context.login()
   → Message generated with timestamp
   → Signer.signMessage() called
   → Signature sent to backend /auth/wallet-login
   → Backend verifies signature
   → JWT token returned
   → Token stored in localStorage

3. Subsequent API requests
   → getHeaders() adds: Authorization: Bearer {token}
   → Backend middleware validates token
   → Request proceeds if valid
   → 401 response if invalid
   → Attempt refresh if token expired
```

### Data Flow Example - Load Employees

```
Frontend                          Backend                        Database
────────────────────────────────────────────────────────────

User clicks "Load"
    ↓
api.getEmployees(1, 10)
    ↓
fetch('/api/employees?...')
    ├─ Header: Authorization: Bearer {token}
    ↓
    ─────────→ Express receives request
              ├─ Auth middleware validates token
              ├─ employeeController.getEmployees()
              ├─ Query MongoDB
              ├─ Return 10 employees
    ←─────────
Response received
    ↓
setEmployees(response.data)
    ↓
UI updates with real data
```

## 🔐 Error Handling

```typescript
// Add interceptor for error handling
class APIService {
  private async request<T>(...) {
    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        // Token expired, try refresh
        await this.refreshToken();
        // Retry original request
        return this.request<T>(endpoint, method, data);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    } catch (error) {
      // Log error
      console.error('API Error:', error);
      // Show toast notification
      // Redirect to login if needed
      throw error;
    }
  }
}
```

## 📝 Common API Calls

### Login

```typescript
const { useWeb3 } = require('../context/Web3Context');

function LoginComponent() {
  const { connect, login } = useWeb3();

  const handleLogin = async () => {
    try {
      await connect(); // Connect wallet
      const user = await login(); // Sign & authenticate
      console.log('Logged in as:', user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <button onClick={handleLogin}>Connect & Login</button>;
}
```

### Get Employees

```typescript
const { useEffect, useState } = require('react');
const { api } = require('../services/api');

function EmployeesList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.getEmployees(1, 20)
      .then(response => setEmployees(response.data.employees))
      .catch(error => console.error('Failed to load:', error));
  }, []);

  return (
    <ul>
      {employees.map(emp => (
        <li key={emp._id}>{emp.name}</li>
      ))}
    </ul>
  );
}
```

### Create Employee

```typescript
const handleCreateEmployee = async (formData) => {
  try {
    const response = await api.createEmployee({
      name: formData.name,
      email: formData.email,
      department: formData.department,
      hourlyRate: formData.hourlyRate,
      walletAddress: formData.walletAddress,
    });
    console.log('Employee created:', response.data);
    loadEmployees(); // Refresh list
  } catch (error) {
    console.error('Failed to create:', error);
  }
};
```

## 🧪 Testing the Connection

### Using cURL
```bash
# Test backend is running
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/wallet-login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x...", "signature":"0x..."}'

# Get employees (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/employees
```

### Using Postman
1. Import collection from `backend/postman-collection.json` (if available)
2. Set {{baseUrl}} variable to `http://localhost:5000`
3. Test endpoints with provided examples

## 🚨 Troubleshooting

### CORS Issues
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:** Backend is already configured with CORS for localhost:8080. If you get this error:

1. Check backend `.env.local` FRONTEND_URL
2. Restart backend server
3. Check DevTools Network tab for Preflight request

### 401 Unauthorized
**Error:** `401 - Token not provided or invalid`

**Solution:**
1. Ensure user logged in: `localStorage.getItem('authToken')`
2. Token might be expired - need refresh
3. Check token in DevTools: `localStorage.clear()` and login again

### 404 Not Found
**Error:** `404 - Cannot POST /api/employees`

**Solution:**
1. Verify backend is running: `npm run dev`
2. Check endpoint spelling matches `routes/employees.ts`
3. Verify API_BASE_URL in frontend config

### Connection Refused
**Error:** `fetch failed` or `ECONNREFUSED`

**Solution:**
```bash
# Ensure backend is running
cd backend && npm run dev

# Check port 5000 is available
netstat -an | grep 5000

# If port in use, change PORT in .env.local
```

## 📚 Next Steps

1. ✅ Start backend: `npm run dev` (in backend/)
2. ✅ Test health endpoint: `curl http://localhost:5000`
3. ✅ Create API service in frontend
4. ✅ Update Web3Context for backend auth
5. ✅ Test login flow
6. ✅ Update dashboard components
7. ✅ Replace mock data with API calls

## 📖 Related Documentation

- Backend API: See `BACKEND_SETUP_GUIDE.md`
- Authentication: See backend `src/middleware/authentication.ts`
- Endpoints: See backend `src/routes/`

---

**You're all set! Start the backend and connect your frontend! 🚀**
