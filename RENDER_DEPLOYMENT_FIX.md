# 🚀 RENDER DEPLOYMENT GUIDE - Complete Fix for White Page Issue

## Problem Summary
Your app shows a white page on Render because:
1. ❌ CORS not configured for GitHub Pages URL
2. ❌ Frontend API Base URL pointing to wrong backend
3. ❌ Environment variables not set on Render

---

## ✅ Solution - Complete Render Setup

### STEP 1: Update GitHub Repository

Push the latest changes (which include fixed configs):

```powershell
cd d:\Finalproject2\decentralizedenterpriseresourceplanning

git add -A
git commit -m "Fix: Production environment configuration and CORS setup"
git push origin main
```

---

### STEP 2: Configure Render Backend Service

#### **If you haven't deployed yet:**

1. Go to [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your repository: `kumarhanwatkar/decentralizedenterpriseresourceplanning`
4. Fill in settings:
   - **Name**: `erp-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free
5. Click **Create Web Service**
6. Go to **Environment** tab and add variables (see below)

#### **If already deployed:**

Go to your service → **Settings** → **Environment**

---

### STEP 3: Set Environment Variables on Render (CRITICAL!)

Add these variables to your Render backend service's **Environment** tab:

```
MONGODB_URI = mongodb+srv://erpuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/erp-db
NODE_ENV = production
PORT = 10000
API_BASE_URL = https://your-service-name.onrender.com
JWT_SECRET = generate-random-32-character-string
REFRESH_TOKEN_SECRET = generate-another-random-32-character-string
BLOCKCHAIN_NETWORK = bsc_testnet
BLOCKCHAIN_RPC_URL = https://data-seed-prebsc-1-b.binance.org:8545
ALLOWED_ORIGINS = https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
FRONTEND_URL = https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
ENABLE_AI_DASHBOARD = true
ENABLE_PAYROLL_STREAMING = true
ENABLE_EMAIL_NOTIFICATIONS = false
ENABLE_2FA = false
LOG_LEVEL = info
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with your actual MongoDB password
- Replace `your-service-name` with your actual Render service name (e.g., `erp-api-xyz`)
- Generate secure JWT secrets using: `require('crypto').randomBytes(16).toString('hex')`

---

### STEP 4: Deploy Frontend to GitHub Pages

#### Option A: Manual GitHub Pages Deployment (RECOMMENDED)

```powershell
# In project root directory

# Install dependencies
npm install

# Build for production
npm run build

# This creates dist/ folder with compiled frontend
```

Then:

1. Go to GitHub repo → **Settings** → **Pages**
2. Set:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/dist`
3. Click **Save**

Your frontend will be live at: `https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/`

#### Option B: GitHub Actions Automated Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: https://your-render-service.onrender.com/api
        VITE_BASE_PATH: /decentralizedenterpriseresourceplanning/
    
    - name: Deploy to Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        cname: kumarhanwatkar.github.io
```

---

### STEP 5: Update Environment Variables Reference

**Important**: Before deployment, update these values in your environment files:

**For `/backend/.env.production`:**
```
API_BASE_URL=https://erp-backend-xyz.onrender.com
ALLOWED_ORIGINS=https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
FRONTEND_URL=https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
```

**For `/.env.production`:**
```
VITE_API_BASE_URL=https://erp-backend-xyz.onrender.com/api
VITE_BASE_PATH=/decentralizedenterpriseresourceplanning/
```

Replace `erp-backend-xyz` with your actual Render service URL.

---

### STEP 6: Test the Deployment

Once deployed, check these:

1. **Backend Health Check**
   ```
   https://your-render-service.onrender.com/health
   ```
   Should return: `{"status":"Server is running","timestamp":"...","environment":"production"}`

2. **Frontend Load**
   ```
   https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
   ```
   Should show the landing page (not white page)

3. **API Connection Test**
   Open browser DevTools (F12) → Network tab
   Navigate to login or any page that makes API calls
   Check if requests go to: `https://your-render-service.onrender.com/api/...`

---

### STEP 7: Troubleshooting

#### **Still White Page?**

1. **Check Browser Console (F12)**:
   - Look for JavaScript errors
   - Check CORS errors

2. **Check Network Requests**:
   - Open DevTools → Network tab
   - Reload page
   - Look for failed requests
   - Check if API requests get CORS errors

3. **Check Render Logs**:
   - Go to Render dashboard → Your service
   - Click **Logs** tab
   - Look for error messages
   - Check if MongoDB connection successful

4. **Verify Environment Variables**:
   ```bash
   # Check what Render received
   # Go to Render dashboard → Logs
   # Look for: "Environment: production"
   ```

---

### STEP 8: Production Checklist

- ✅ Backend deployed to Render
- ✅ All environment variables set on Render
- ✅ MongoDB Atlas connection working
- ✅ CORS configured with GitHub Pages URL
- ✅ Frontend built with correct base path
- ✅ AWS health check passes
- ✅ API calls go to correct backend URL
- ✅ No JavaScript errors in console

---

## 🔗 Quick Reference URLs

```
Landing Page:    https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
Backend API:     https://your-render-service.onrender.com/api
Health Check:    https://your-render-service.onrender.com/health
GitHub Repo:     https://github.com/kumarhanwatkar/decentralizedenterpriseresourceplanning
```

---

## 📝 Next Steps

1. Push all changes to GitHub
2. Deploy backend to Render with correct environment variables
3. Build and deploy frontend to GitHub Pages
4. Test the application
5. If issues persist, check Render logs and browser DevTools

---

## 💡 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| White page | CSS/JS not loading | Check base path in vite.config |
| API calls fail | CORS not configured | Add frontend URL to ALLOWED_ORIGINS |
| 404 errors on page refresh | Missing history mode | Frontend uses HashRouter ✓ (already configured) |
| Database connection error | Wrong MongoDB URI | Check MONGODB_URI in Render environment |
| SSL certificate errors | HTTPS not working | Render provides free HTTPS ✓ |

---

**Questions?** Check logs in Render dashboard or browser DevTools for specific errors.
