# ⚡ Quick Start: Get Deployed in 1 Hour

**TL;DR version** - Just the essential steps, no extra reading.

---

## What You're Doing

Deploying your ERP to the cloud with:
- **Frontend**: GitHub Pages (free)
- **Backend**: Render (free)
- **Database**: MongoDB Atlas (free)

---

## Prerequisites

- [ ] GitHub account (create at github.com if needed)
- [ ] 60 minutes
- [ ] Node.js installed

---

## Step 1: Create GitHub Repo (5 min)

```powershell
# Go to github.com/new
# Create public repo named: decentralized-erp
# Clone locally:
git clone https://github.com/YOUR_USERNAME/decentralized-erp.git
cd decentralized-erp

# Configure git (one-time)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## Step 2: Setup MongoDB Atlas (15 min)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create account
3. Create **M0 free cluster**
4. Create database user: `erpuser` with strong password
5. Allow access from anywhere (Network Access)
6. Get connection string: `mongodb+srv://erpuser:PASSWORD@cluster0.xxxxx.mongodb.net/erp-db`
   - **Replace PASSWORD with your actual password**

**Save this connection string!**

---

## Step 3: Create `.env` Files

**File**: `backend/.env`
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://erpuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/erp-db
JWT_SECRET=make-up-random-32-character-string-here-xyz123abc456def789ghi
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=another-random-32-character-string-here-abc123def456ghi789jkl
REFRESH_TOKEN_EXPIRE=30d
BLOCKCHAIN_NETWORK=bsc_testnet
BLOCKCHAIN_RPC_URL=https://data-seed-prebsc-1-b.binance.org:8545
CORS_ORIGINS=https://YOUR_USERNAME.github.io/decentralized-erp/,https://erp-api-xyz.onrender.com
FRONTEND_URL=https://YOUR_USERNAME.github.io/decentralized-erp/
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
EMAIL_FROM=noreply@yourapp.com
EMAIL_FROM_NAME=ERP System
```

**File**: `decentralizedenterpriseresourceplanning/.env.local`
```
VITE_API_BASE_URL=http://localhost:5000/api
```

⚠️ **Don't commit `.env` files!** (Already in .gitignore)

---

## Step 4: Push to GitHub (5 min)

```powershell
cd d:\Finalproject2  # Your project root

git add .
git commit -m "Initial commit: Full ERP project"
git push -u origin main

# Verify on GitHub.com - should see backend/ and frontend/ folders
```

---

## Step 5: Deploy Backend to Render (10 min)

1. Go to https://render.com
2. Sign up with GitHub
3. Create **New Web Service**
   - Repository: `decentralized-erp`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. Create Service

Wait for deployment...

5. Once deployed, go to **Environment** tab
6. Add environment variables (copy from your `.env` file):
   ```
   MONGODB_URI = (your connection string)
   NODE_ENV = production
   JWT_SECRET = (your secret)
   REFRESH_TOKEN_SECRET = (your secret)
   BLOCKCHAIN_NETWORK = bsc_testnet
   BLOCKCHAIN_RPC_URL = https://data-seed-prebsc-1-b.binance.org:8545
   ```
   (Add all variables from .env)

7. Click **Save**

**Your backend URL**: `https://erp-api-xyz.onrender.com`

---

## Step 6: Deploy Frontend (7 min)

### Option A: GitHub Pages (Easiest)

1. Edit `decentralizedenterpriseresourceplanning/vite.config.ts`:
```typescript
export default defineConfig({
  base: '/decentralized-erp/',  // ADD THIS LINE
  plugins: [react()],
  // ... rest stays same
})
```

2. Push to GitHub:
```powershell
git add vite.config.ts
git commit -m "Configure for GitHub Pages"
git push origin main
```

3. Go to GitHub:
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: /(root)
   - Save

4. Wait 2-3 minutes. Your site is at:
```
https://YOUR_USERNAME.github.io/decentralized-erp/
```

### Option B: Render Static (If A doesn't work)

1. At Render, create **New Static Site**
2. Repository: `decentralized-erp`
3. Build Command: `cd decentralizedenterpriseresourceplanning && npm install && npm run build`
4. Publish Directory: `decentralizedenterpriseresourceplanning/dist`
5. Add Environment Variable:
   ```
   VITE_API_BASE_URL = https://erp-api-xyz.onrender.com/api
   ```
6. Create Site

---

## Step 7: Connect Frontend to Backend (3 min)

Update: `decentralizedenterpriseresourceplanning/.env.local`
```
VITE_API_BASE_URL=https://erp-api-xyz.onrender.com/api
```
(Replace with your actual Render backend URL)

Push:
```powershell
cd decentralizedenterpriseresourceplanning
git add .env.local
git commit -m "Update API URL to production backend"
git push origin main
```

Frontend auto-redeploys!

---

## Step 8: Test (3 min)

1. Open your frontend URL in browser
2. Press F12 (DevTools)
3. Go to **Network** tab
4. Navigate to any page
5. Should see requests like `https://erp-api-xyz.onrender.com/api/employees`
6. Status should be **200** (green)
7. Data should display on page

✅ **You're done!**

---

## Verification Checklist

- [ ] Backend deployed and Health check works: `https://erp-api-xyz.onrender.com/api/health`
- [ ] Frontend loads
- [ ] Network tab shows API calls
- [ ] Data displays on pages
- [ ] No CORS errors in console

---

## Troubleshooting

### Backend won't deploy
- Check Render Logs tab for errors
- Usually: npm install or build failed
- Fix: Run `npm ci && npm run build` locally to test

### Frontend can't reach backend
- Check DevTools console for errors
- Verify VITE_API_BASE_URL is correct
- Check backend is actually running
- Test backend URL directly in browser

### MongoDB connection error
- Check password is correct
- Check IP is whitelisted in MongoDB Atlas
- Copy exact connection string from MongoDB

### Still stuck?
Read the detailed guides:
- DEPLOYMENT_GUIDE_INDEX.md (navigation)
- STEP_BY_STEP_DEPLOYMENT.md (detailed steps)
- ENVIRONMENT_VARIABLES.md (variable help)

---

## Done! 🎉

Your ERP is now live online!

Share the frontend URL with others.

Update code anytime:
```powershell
git add .
git commit -m "Your message"
git push origin main
# Auto-deploys in 2-3 minutes!
```

---

## Files I Created For You

All in `d:\Finalproject2\`:

1. **DEPLOYMENT_GUIDE_INDEX.md** - Navigation guide
2. **UNDERSTANDING_DEPLOYMENT.md** - Concepts explained
3. **RENDER_VS_RAILWAY.md** - Platform comparison
4. **STEP_BY_STEP_DEPLOYMENT.md** - Detailed steps
5. **LOCAL_SETUP_GUIDE.md** - Test locally first
6. **DEPLOYMENT_AND_GITHUB_GUIDE.md** - Comprehensive reference
7. **ENVIRONMENT_VARIABLES.md** - All variables explained
8. **.gitignore** - Git ignore rules
9. This file: **QUICK_DEPLOY.md**

Read them as needed!

---

**Good luck! 🚀**

You got this!
