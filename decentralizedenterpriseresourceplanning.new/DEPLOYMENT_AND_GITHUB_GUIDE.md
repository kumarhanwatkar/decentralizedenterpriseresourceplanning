# Complete Deployment Guide: GitHub + MongoDB Atlas + Free Backend Hosting

This guide will take you through:
1. ✅ Pushing your full project to GitHub
2. ✅ Setting up MongoDB Atlas (free)
3. ✅ Deploying backend to Render or Railway (free)
4. ✅ Connecting everything together

**Total time**: ~1-2 hours

---

## PART 1: GitHub Setup (You'll Do This)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `decentralized-erp` (or your preferred name)
3. **Description**: "Decentralized ERP System - Node.js + React + MongoDB"
4. **Public** (so free deployment platforms can access it)
5. **Add .gitignore**: Select Node.js
6. **Add license**: MIT (optional but recommended)
7. Click **Create repository**

### Step 2: Clone Your Repository Locally

```bash
# Copy the HTTPS URL from GitHub (green "Code" button)
# Then in PowerShell:
cd d:\Finalproject2
git clone https://github.com/YOUR_USERNAME/decentralized-erp.git
cd decentralized-erp
```

**If you already have git initialized**, instead:
```bash
cd d:\Finalproject2

# If not a git repo yet
git init

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/decentralized-erp.git

# Set branch name
git branch -M main

# Pull initial files (if you created with README)
git pull origin main --allow-unrelated-histories
```

### Step 3: Monorepo Structure

Your project should look like this on GitHub:

```
decentralized-erp/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .gitignore
│   ├── .env.example
│   └── README.md
├── decentralizedenterpriseresourceplanning/  (frontend)
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .gitignore
│   ├── .env.example
│   └── README.md
├── .gitignore  (root level)
├── README.md   (root project overview)
└── DEPLOYMENT_AND_GITHUB_GUIDE.md
```

### Step 4: Root .gitignore

**Create/update**: `d:\Finalproject2\.gitignore`

```
# Node
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build outputs
dist/
build/
.next/
.nuxt/
coverage/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Misc
.cache/
temp/
uploads/
```

### Step 5: Add Files to Git

```powershell
# In d:\Finalproject2\
cd d:\Finalproject2

# Add all project files
git add .

# Commit
git commit -m "Initial commit: Full ERP project (frontend + backend)"

# Push to GitHub
git push -u origin main
```

### Step 6: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/decentralized-erp
2. You should see both `backend/` and `decentralizedenterpriseresourceplanning/` folders
3. Verify all files are there

---

## PART 2: MongoDB Atlas Setup (You'll Do This)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Fill in:
   - Email: (your email)
   - Password: (strong password)
   - Terms: Check both boxes
3. Click **Create your Atlas account**
4. **Verify email** - Check your inbox

### Step 2: Create Free Cluster

1. After login, click **Create** (or **Build a Database**)
2. Choose **M0 Shared** tier (FREE forever for 512 MB storage)
3. **Cloud Provider**: AWS (default)
4. **Region**: Select one close to you (e.g., us-east-1)
5. **Cluster Name**: `erp-cluster` or `dev-cluster`
6. Click **Create Deployment**

⏳ *Wait 2-3 minutes for cluster to be ready*

### Step 3: Create Database User

1. After cluster is ready, click **Add Connection** or **Database Access**
2. Go to **Database Access** tab
3. Click **Add New Database User**
4. **Username**: `erpuser` (or your preferred name)
5. **Password**: (generate strong password - COPY IT!)
6. **Built-in Role**: `readWriteAnyDatabase`
7. Click **Add User**

⚠️ **IMPORTANT**: Save this password - you'll need it!

### Step 4: Setup Network Access

1. Go to **Network Access** tab
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (or enter 0.0.0.0/0)
   - This is safe because your database credentials are protected
4. Click **Confirm**

### Step 5: Get Connection String

1. Go to **Databases** tab
2. Click **Connect** on your cluster
3. Select **Drivers** → **Node.js** → version **4.1 or later**
4. Copy the connection string:
   ```
   mongodb+srv://erpuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Replace** `<password>` with your actual password
6. Your final connection string looks like:
   ```
   mongodb+srv://erpuser:MySecurePassword123@erp-cluster.xxxxx.mongodb.net/erp-db?retryWrites=true&w=majority
   ```

⚠️ **SAVE THIS** - You'll need it for deployment!

---

## PART 3: Environment Variables Setup (I Can Do Some)

### What I've Done:

✅ Backend already has `.env.example` file with all needed variables
✅ Frontend already has `.env.example` file

### What You Need:

**For Backend** (`.env` file in backend folder):

Based on your MongoDB Atlas connection:

```
# ========== SERVER CONFIG ==========
NODE_ENV=production
PORT=5000
API_BASE_URL=https://your-backend-name.onrender.com
SERVER_HOST=0.0.0.0

# ========== DATABASE CONFIG ==========
MONGODB_URI=mongodb+srv://erpuser:YOUR_PASSWORD@erp-cluster.xxxxx.mongodb.net/erp-db?retryWrites=true&w=majority
MONGODB_USER=erpuser
MONGODB_PASSWORD=YOUR_PASSWORD
MONGODB_TEST_URI=mongodb://localhost:27017/erp-test

# ========== JWT & AUTHENTICATION ==========
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this-NOW!
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-characters-NOW!
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
EMAIL_FROM=noreply@yourapp.com
EMAIL_FROM_NAME=ERP System

# ========== CORS CONFIG ==========
FRONTEND_URL=https://your-frontend-url.com
FRONTEND_URL_PRODUCTION=https://your-frontend-url.com
ALLOWED_ORIGINS=https://your-frontend-url.com,https://your-backend-name.onrender.com

# ========== Optional: AI Service ==========
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4
```

**For Frontend** (`.env.local` in frontend folder):

```
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
```

---

## PART 4: Deploy Backend to Render (Recommended - Easier)

### Step 1: Connect GitHub to Render

1. Go to https://render.com
2. Click **Sign up** → **Continue with GitHub**
3. Authorize Render to access your GitHub
4. Go to **Dashboard**

### Step 2: Create Web Service

1. Click **New +** → **Web Service**
2. **Repository**: Select `decentralized-erp`
3. **Root Directory**: `backend`
4. **Build Command**: 
   ```
   npm install && npm run build
   ```
5. **Start Command**: 
   ```
   npm run start
   ```
6. **Environment**: Node
7. Click **Create Web Service**

### Step 3: Add Environment Variables

1. In Render dashboard, go to your service
2. Go to **Environment** tab
3. **Copy all from your `.env` file** and add as environment variables:
   - Click **Add Environment Variable**
   - Paste each one individually:
     ```
     MONGODB_URI = mongodb+srv://erpuser:PASSWORD@erp-cluster.xxxxx.mongodb.net/erp-db?retryWrites=true&w=majority
     NODE_ENV = production
     JWT_SECRET = your-secret-key
     ... (add all from .env)
     ```

4. Click **Save**

### Step 4: Watch Deployment

1. Render will auto-deploy from GitHub
2. Watch **Logs** tab for build progress
3. Once deployed, you'll get a URL like:
   ```
   https://your-api-name.onrender.com
   ```

4. Test it:
   ```
   https://your-api-name.onrender.com/api/health
   ```

---

## PART 5: Deploy Frontend to GitHub Pages or Render

### Option A: GitHub Pages (Easiest)

1. In your frontend's `vite.config.ts`, update:
```typescript
export default defineConfig({
  base: '/decentralized-erp/',  // Add this line
  plugins: [react()],
  // ... rest
})
```

2. Push to GitHub:
```powershell
cd d:\Finalproject2\decentralizedenterpriseresourceplanning
git add .
git commit -m "Configure for GitHub Pages"
git push origin main
```

3. Go to your **GitHub repository** → **Settings** → **Pages**
4. **Source**: Deploy from branch
5. **Branch**: main
6. **Folder**: /(root)
7. Create GitHub Actions workflow (I'll provide template)

### Option B: Render Static Site

1. At Render, click **New +** → **Static Site**
2. Select repository: `decentralized-erp`
3. **Build Command**: 
   ```
   cd decentralizedenterpriseresourceplanning && npm install && npm run build
   ```
4. **Publish Directory**: `decentralizedenterpriseresourceplanning/dist`
5. Add **Environment Variable**:
   ```
   VITE_API_BASE_URL = https://your-backend-name.onrender.com/api
   ```
6. Click **Create Static Site**

---

## PART 6: Verification Checklist

### ✅ GitHub
- [ ] Repository created
- [ ] Both frontend and backend folders pushed
- [ ] .gitignore working (no node_modules)
- [ ] Can see code on GitHub.com

### ✅ MongoDB Atlas
- [ ] Cluster created (M0 free tier)
- [ ] Database user created
- [ ] Network access allowed
- [ ] Connection string copied and tested locally

### ✅ Backend Deployed
- [ ] Render/Railway account created
- [ ] Backend deployed from GitHub
- [ ] Environment variables added
- [ ] Service URL working (test /health endpoint)

### ✅ Frontend Deployed
- [ ] Frontend deployed to GitHub Pages or Render
- [ ] Frontend `VITE_API_BASE_URL` points to backend
- [ ] Can access frontend URL
- [ ] API calls work (check Network tab)

---

## Troubleshooting

### MongoDB Connection Error
```
MongoNetworkError: failed to connect to server
```
**Solution**:
1. Check connection string has correct password
2. Verify IP address is whitelisted in Atlas Network Access
3. Check `MONGODB_URI` matches your password

### Render Backend Shows Build Error
```
ERR! code ERESOLVE
```
**Solution**:
```bash
# In backend folder, run locally:
npm ci  # Clean install
npm run build
```

### Frontend Can't Call Backend
**Check in DevTools Network tab**:
1. What URL is frontend trying to reach?
2. Is CORS error shown?
3. Does `VITE_API_BASE_URL` match Render backend URL?

### Port Already in Use (Local Testing)
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Summary

You now have:

1. ✅ **Local Development**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Database: MongoDB Atlas cloud

2. ✅ **GitHub Repository**
   - Both frontend and backend
   - Clean monorepo structure
   - Ready for collaboration

3. ✅ **Free Deployment**
   - Backend: Render (or Railway)
   - Frontend: GitHub Pages (or Render)
   - Database: MongoDB Atlas 512 MB free

4. ✅ **Environment variables**
   - Local: `.env` files
   - Production: Deployed on Render/Railway

---

## Next Steps

1. **Test locally first**:
   ```bash
   # Terminal 1: Backend
   cd backend
   npm install
   npm run dev
   
   # Terminal 2: Frontend
   cd decentralizedenterpriseresourceplanning
   npm install
   npm run dev
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial full project commit"
   git push origin main
   ```

3. **Deploy to Render**:
   - Point Render to your GitHub repo
   - Add environment variables
   - Watch the deployment logs

4. **Test production**:
   - Visit your deployed frontend
   - Check Network tab for API calls
   - Verify data loads from cloud MongoDB

---

**Need help?** Check these docs in your backend:
- `BACKEND_SETUP_GUIDE.md` - Backend configuration
- `AUTH_DOCUMENTATION.md` - Authentication setup
- Backend `README.md` - Quick start

Good luck! 🚀
