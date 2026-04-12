# 🎯 COMPLETE RENDER DEPLOYMENT - Step-by-Step Fix

## Overview

Your ERP project has **3 layers**:
1. **Frontend**: React + Vite (deployed on GitHub Pages at `/decentralizedenterpriseresourceplanning/`)
2. **Backend**: Node.js + Express (deployed on Render)
3. **Database**: MongoDB Atlas (free tier)

The white page happens because these layers aren't communicating properly.

---

## 📋 Deployment Checklist

### Phase 1: Code Preparation ✅ (COMPLETED)

- ✅ Fixed CORS configuration in `backend/src/config/environment.ts`
- ✅ Created `.env.production` for frontend
- ✅ Created `backend/.env.production` for backend
- ✅ Updated `vite.config.ts` with production optimization  
- ✅ Created `render.yaml` for Render deployment
- ✅ Created deployment verification script

### Phase 2: GitHub Push (DO THIS NOW)

```powershell
cd d:\Finalproject2\decentralizedenterpriseresourceplanning

# Verify all changes
git status

# Stage all changes
git add -A

# Commit
git commit -m "Fix: Production environment configuration and CORS setup for Render + GitHub Pages"

# Push to GitHub
git push origin main

# Verify on GitHub.com
```

### Phase 3: Deploy Backend to Render (MANUAL STEPS)

**Note**: Render cannot read `.env.production` - you must set variables manually

#### Option A: If You Haven't Created Service Yet

1. Go to [render.com](https://render.com) → Dashboard
2. Click **New +** → **Web Service**
3. Select your GitHub repository: `kumarhanwatkar/decentralizedenterpriseresourceplanning`
4. Fill in settings:
   ```
   Name:              erp-backend
   Root Directory:    backend
   Runtime:           Node
   Build Command:     npm install && npm run build
   Start Command:     npm run start
   Plan:              Free
   ```
5. Click **Create Web Service**

#### Option B: If Service Already Exists

1. Go to Render Dashboard → Select `erp-backend` service
2. Go to **Settings** → Scroll down to find **Build & Deploy** section
3. Verify these are set:
   ```
   Build Command:  npm install && npm run build
   Start Command:  npm run start
   Root Directory: backend
   ```

### Phase 4: Set Environment Variables on Render

**IMPORTANT**: These MUST be set in Render UI, not in .env files

1. In Render dashboard → Select `erp-backend`
2. Go to **Environment** tab
3. Add each variable by clicking **Add Environment Variable**

**Required Variables** (Replace placeholders):

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render assigns random port |
| `API_BASE_URL` | `https://YOUR-SERVICE-NAME.onrender.com` | Get from Render URL |
| `MONGODB_URI` | `mongodb+srv://erpuser:PASS@cluster.xxx` | From MongoDB Atlas |
| `JWT_SECRET` | `(random 32 chars)` | Generate random value |
| `REFRESH_TOKEN_SECRET` | `(random 32 chars)` | Generate random value |
| `BLOCKCHAIN_NETWORK` | `bsc_testnet` | |
| `BLOCKCHAIN_RPC_URL` | `https://data-seed-prebsc-1-b.binance.org:8545` | |
| `ALLOWED_ORIGINS` | `https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/` | **Critical for CORS** |
| `FRONTEND_URL` | `https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/` | |
| `ENABLE_AI_DASHBOARD` | `true` | |
| `ENABLE_PAYROLL_STREAMING` | `true` | |
| `ENABLE_EMAIL_NOTIFICATIONS` | `false` | |
| `LOG_LEVEL` | `info` | |

**Generate JWT Secrets** (in Node.js shell):
```javascript
require('crypto').randomBytes(16).toString('hex')
// Returns: something like "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

Click **Save** after adding each variable.

### Phase 5: Deploy Frontend to GitHub Pages

```powershell
# In project root
cd d:\Finalproject2\decentralizedenterpriseresourceplanning

# Install dependencies (if not already done)
npm install

# Build frontend
npm run build

# This creates the 'dist' folder
```

Then configure GitHub Pages:

1. Go to GitHub → Your repo → **Settings** → **Pages**
2. Set:
   ```
   Source: Deploy from a branch
   Branch: main
   Folder: /(root)  <- Change this to /dist
   ```
3. **Save**
4. Wait ~5 minutes for deployment
5. Check: `https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/`

---

## ✅ Verification

After deployment, verify the complete flow:

### 1. Backend Health Check
```
GET https://YOUR-RENDER-URL.onrender.com/health
```

Should return:
```json
{
  "status": "Server is running",
  "timestamp": "2026-04-12T10:00:00.000Z",
  "environment": "production"
}
```

### 2. Frontend Loads
```
https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
```

Should show:
- Landing page with content (not white)
- No JavaScript errors in DevTools (F12)
- No CORS errors in Network tab

### 3. API Calls Work
1. Open Firefox DevTools (F12) → Network tab
2. Click Login or any page with API calls
3. Check requests go to:
   ```
   https://YOUR-RENDER-URL.onrender.com/api/...
   ```
4. Response should be successful (green)

---

## 🐛 Troubleshooting

### Problem: Still White Page

**Step 1: Check Frontend**
```
1. Open https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
2. Press F12 → Console tab
3. Look for RED errors
```

**Common Frontend Errors:**
- `Cannot find module` → Missing dependencies (run `npm install`)
- `Cannot GET /` → Wrong GitHub Pages branch/folder configuration  
- `net::ERR_FILE_NOT_FOUND` → Files not in correct location

**Step 2: Check Backend**
1. Go to Render dashboard → Your service → **Logs**
2. Look for:
   ```
   ❌ ECONNREFUSED (MongoDB not connecting)
   ❌ Cannot find module (missing dependency)
   ✅ "Server running" (good sign)
   ```

**Step 3: Check CORS**
1. Open frontend in browser
2. Press F12 → Network tab
3. Try to login or make API call
4. Look for request to backend
5. Check Response tab for `Access-Control-Allow-Origin`

If you see CORS error like:
```
Access to XMLHttpRequest at 'https://xxx.onrender.com/api/...' from origin 
'https://kumarhanwatkar.github.io' has been blocked by CORS policy
```

**Fix**: 
1. Go to Render → Environment variables
2. Update `ALLOWED_ORIGINS` to include:
   ```
   https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
   ```

### Problem: Frontend loads but no styles

**Causes:**
- CSS file path wrong
- Base path mismatch

**Fix**:
1. Rebuild: `npm run build`
2. Check `dist/index.html` includes CSS with correct paths
3. Verify vite.config.ts has correct base path

### Problem: API calls timeout

**Causes:**
- Render backend sleeping (free tier goes idle)
- Wrong API URL
- MongoDB connection failing

**Fix**:
1. Check Render logs for MongoDB errors
2. Verify MONGODB_URI is correct
3. Check MongoDB Atlas allows connections from Render IP

### Problem: 404 on page refresh (browser address bar navigation)

**Status**: ✅ Already Fixed
- Frontend uses HashRouter
- URLs like `app.com/#/login` work on refresh
- No special server config needed

---

## 📁 Project Structure

```
decentralizedenterpriseresourceplanning/
├── frontend files (React + Vite)
├── src/                          # React components
├── dist/                         # Built frontend (after npm run build)
├── package.json                  # Frontend deps
├── vite.config.ts               # Frontend build config
├── .env.development             # Dev frontend env
├── .env.production              # Prod frontend env
│
├── backend/
│   ├── src/
│   │   ├── server.ts           # Entry point
│   │   ├── app.ts              # Express setup
│   │   └── config/
│   │       └── environment.ts   # Environment config ✅ FIXED
│   ├── package.json            # Backend deps
│   ├── .env.development        # Dev backend env
│   └── .env.production         # Prod backend env ✅ CREATED
│
├── render.yaml                  # Render config ✅ CREATED
├── deployment-verify.js         # Verification script ✅ CREATED
├── RENDER_DEPLOYMENT_FIX.md     # This file ✅ CREATED
└── README.md
```

---

## 🔄 Deployment Flow

```
1. Push to GitHub
   └─> GitHub Actions (if configured)
       └─> Builds frontend to /dist

2. GitHub Pages serves /dist
   └─> Available at your custom URL

3. Render detects push to main
   └─> Builds backend
   └─> Starts with environment variables
   └─> MongoDB connects successfully

4. User visits frontend URL
   └─> Loads React app
   └─> React makes API calls to Render backend
   └─> Backend responds with CORS headers
   └─> User sees dashboard
```

---

## ⚡ Quick Commands

```powershell
# Verify build works locally
npm run build

# Test backend locally
cd backend
npm install
npm run build
npm start

# Push all changes
git add -A
git commit -m "Deployment fixes"
git push origin main

# View Render logs
# Go to: render.com → Your service → Logs

# Verify frontend deployed
# Go to: https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/

# Check backend health
# Curl: https://YOUR-RENDER-URL.onrender.com/health
```

---

## 📞 Support Resources

- Render Help: https://render.com/docs
- GitHub Pages: https://docs.github.com/en/pages
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

---

## ✨ Final Checklist

Before considering deployment complete, verify:

- ✅ All code pushed to GitHub (`main` branch)
- ✅ Backend environment variables set on Render
- ✅ MongoDB connection working (test in Render logs)
- ✅ Frontend built and in `/dist` folder
- ✅ GitHub Pages pointing to `/dist` folder
- ✅ Frontend loads at `https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/`
- ✅ Browser console shows no errors
- ✅ Backend health check passes
- ✅ Frontend can make API calls to backend
- ✅ No CORS errors in Network tab
- ✅ Login page works

---

**You're all set! 🚀**

If you still see a white page after following these steps, enable verbose logging in your browser DevTools to identify the specific error.
