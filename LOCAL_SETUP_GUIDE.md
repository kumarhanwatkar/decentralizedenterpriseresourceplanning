# 🚀 Quick Start: Run Locally Before Deploying

**Before you deploy to production, test everything locally to make sure it works!**

This guide shows you how to run both backend and frontend locally with MongoDB Atlas.

---

## Prerequisites

Make sure you have:
- ✅ Node.js 16+ installed: https://nodejs.org/
- ✅ Git installed: https://git-scm.com/
- ✅ MongoDB Atlas cluster created (with connection string)
- ✅ VS Code (recommended): https://code.visualstudio.com/

Check versions:
```powershell
node --version    # Should be v16 or higher
npm --version     # Should be v8 or higher
git --version     # Should show git version
```

---

## Step 1: Clone Your Repository

```powershell
# Navigate to where you want the project
cd d:\development  # or any folder

# Clone the repository (replace YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/decentralized-erp.git
cd decentralized-erp

# Verify structure
dir
# Should show: backend, decentralizedenterpriseresourceplanning
```

---

## Step 2: Setup Environment Variables

### 2.1: Backend `.env` File

**Create file**: `d:\development\decentralized-erp\backend\.env`

```
# ========== SERVER CONFIG ==========
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000
SERVER_HOST=localhost

# ========== DATABASE CONFIG ==========
# Get this from MongoDB Atlas
MONGODB_URI=mongodb+srv://erpuser:YOUR_PASSWORD@erp-cluster.xxxxx.mongodb.net/erp-db?retryWrites=true&w=majority
MONGODB_USER=erpuser
MONGODB_PASSWORD=YOUR_PASSWORD
MONGODB_TEST_URI=mongodb://localhost:27017/erp-test

# ========== JWT & AUTHENTICATION ==========
JWT_SECRET=dev-secret-key-32-characters-minimum-please-change-this
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=dev-refresh-secret-32-characters-minimum-please-change
REFRESH_TOKEN_EXPIRE=30d

# ========== BLOCKCHAIN CONFIG ==========
BLOCKCHAIN_NETWORK=bsc_testnet
BLOCKCHAIN_RPC_URL=https://data-seed-prebsc-1-b.binance.org:8545
SMART_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
ORGANIZATION_WALLET_ADDRESS=0x0000000000000000000000000000000000000000
ORGANIZATION_WALLET_PRIVATE_KEY=

# ========== EMAIL CONFIG ==========
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=noreply@localhost
EMAIL_FROM_NAME=ERP Dev

# ========== CORS CONFIG ==========
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_PRODUCTION=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:5000

# ========== RATE LIMITING ==========
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.2: Frontend `.env.local` File

**Create file**: `d:\development\decentralized-erp\decentralizedenterpriseresourceplanning\.env.local`

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Step 3: Install Dependencies

### 3.1: Install Backend Dependencies

```powershell
cd d:\development\decentralized-erp\backend

npm install

# Should see: added X packages
```

### 3.2: Install Frontend Dependencies

```powershell
cd d:\development\decentralized-erp\decentralizedenterpriseresourceplanning

npm install

# Should see: added X packages
```

---

## Step 4: Start Backend

**Terminal 1** (Backend):

```powershell
cd d:\development\decentralized-erp\backend

npm run dev

# Expected output:
# 🚀 Server running at http://localhost:5000
# ✅ Connected to MongoDB
# Environment: development
```

**Test backend**:
```powershell
# In another PowerShell window:
curl http://localhost:5000/api/health

# Should see: {"status":"ok","timestamp":"..."}
```

---

## Step 5: Start Frontend

**Terminal 2** (Frontend):

```powershell
cd d:\development\decentralized-erp\decentralizedenterpriseresourceplanning

npm run dev

# Expected output:
# VITE v... 
# ➜ Local: http://localhost:5173
```

**Open in Browser**:
```
http://localhost:5173
```

---

## Step 6: Test the Connection

1. **Open DevTools**: Press `F12` in browser
2. **Go to Network tab**
3. **Navigate to any page** that loads data (e.g., Employee, Payroll)
4. **Watch Network tab**:
   - Should see requests like: `http://localhost:5000/api/employees`
   - Status should be `200` (green)
   - Response should show data

5. **Check Console tab**:
   - Should see no red errors
   - May see some warnings (those are OK)

---

## Step 7: Test Full Workflow

### 7.1: Login
1. Go to login page
2. Use any credentials (if auth is connected)
3. Should show dashboard

### 7.2: View Data
1. Navigate to Payroll, Resources, Transactions
2. Data should load from backend
3. Check Network tab shows API calls

### 7.3: Test Real-time Updates
1. Keep payroll page open
2. Watch the streaming numbers update
3. Should see changes every second

### 7.4: Test Create/Update (if implemented)
1. Try creating transaction or updating resource
2. Should see success message
3. Check backend logs for activity
4. Refresh page - data should persist

---

## Troubleshooting Local Setup

### Backend fails to start

**Error**: `MongoNetworkError`
```
Solution:
1. Check MONGODB_URI is correct
2. Check password doesn't have special chars needing escape
3. Check IP is whitelisted in MongoDB Atlas
4. Try connecting from another tool: mongosh --uri "your-connection-string"
```

**Error**: `Port 5000 already in use`
```powershell
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
# Then try npm run dev again
```

**Error**: `Cannot find module 'mongoose'`
```powershell
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### Frontend fails to start

**Error**: `npm ERR! ELIFECYCLE`
```powershell
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules package-lock.json
npm install
npm run dev
```

**Error**: `Port 5173 already in use`
```powershell
# Vite usually runs on next available port
# Or manually kill the process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Frontend can't reach backend

**Error in Console**: `Failed to fetch from http://localhost:5000`

Check:
1. Backend is running (`npm run dev` in backend terminal)
2. `.env.local` has correct `VITE_API_BASE_URL=http://localhost:5000/api`
3. Backend CORS allows `http://localhost:5173`
4. No firewall blocking

### Data won't load

**Check**:
1. Network tab shows request to backend
2. Response status is 200 (not 404 or 500)
3. Response has actual data (not empty)
4. Frontend console has no errors

**Debug**:
```
Backend terminal: Check for error logs
Frontend console: Check for error messages
Network tab: Check full response body
```

---

## Stop Services

### Stop Backend
```powershell
# In backend terminal: Press Ctrl+C
# Or kill the process:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Stop Frontend
```powershell
# In frontend terminal: Press Ctrl+C
# Or kill the process:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## Next Steps After Local Testing

✅ **If everything works locally:**

1. Push to GitHub:
   ```powershell
   git add .
   git commit -m "Working local version"
   git push origin main
   ```

2. Follow STEP_BY_STEP_DEPLOYMENT.md to deploy to Render

✅ **If something doesn't work:**

1. Check logs in both terminals
2. Check Network tab in DevTools
3. Check browser console for errors
4. Verify .env files have correct values
5. Restart both services (stop and npm run dev again)

---

## Common Commands Reference

```powershell
# Backend
cd backend
npm run dev                # Start development server
npm run build              # Build for production
npm run test               # Run tests
npm run lint               # Check code style
npm run type-check         # Check TypeScript types

# Frontend
cd decentralizedenterpriseresourceplanning
npm run dev                # Start development server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Check code style
npm run test               # Run tests

# Git
git add .                  # Stage all changes
git commit -m "message"    # Commit with message
git push origin main       # Push to GitHub
git pull origin main       # Pull latest from GitHub
git status                 # Check current status
```

---

## Terminal Setup Tips

**Pro Tip: Use multiple terminals**

- **Terminal 1**: Backend (`npm run dev`)
- **Terminal 2**: Frontend (`npm run dev`)
- **Terminal 3**: Git commands (`git push`, etc)

**Or use VS Code integrated terminals**:
1. Open VS Code
2. Ctrl+` (backtick) to open terminal
3. Click "+" icon to add another terminal
4. Run backend and frontend in separate tabs

---

## You're Ready! 🎉

Once everything works locally:
1. Test a few features
2. Push to GitHub
3. Deploy to Render (follow STEP_BY_STEP_DEPLOYMENT.md)
4. Test on deployed URLs
5. Share with others!

**Next**: `STEP_BY_STEP_DEPLOYMENT.md` for production deployment
