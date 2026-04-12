# 🔧 GITHUB ACTIONS FIX - Deprecated Actions Error

## Problem
The GitHub Actions workflow failed with this error:
```
Error: This request has been automatically failed because it uses 
a deprecated version of 'actions/upload-artifact: v3'
```

## ✅ Solution: Replace with Updated Workflow

### STEP 1: Delete Old Workflow

1. Go to your repository
2. Navigate to: `.github/workflows/deploy.yml`
3. Click the **trash icon** or **Delete file**
4. Commit the deletion

---

### STEP 2: Create New Fixed Workflow

1. Click **Create new file**
2. Name: `.github/workflows/pages-deploy.yml`
3. **Copy and paste this updated code** (exact):

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: npm
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build frontend
        run: npm run build
        env:
          VITE_API_BASE_URL: https://erp-api-pr9p.onrender.com/api
          VITE_BASE_PATH: /decentralizedenterpriseresourceplanning/
      
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

4. Click **Commit new file**

---

### STEP 3: GitHub Will Auto-Deploy

1. Go to **Actions** tab
2. You'll see "Deploy Frontend to GitHub Pages" running
3. Wait for **green checkmark** ✅ (should complete in ~2-3 minutes)

---

### STEP 4: Verify Your Site

Visit: `https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/`

You should see:
- ✅ **Landing page with content** (not white!)
- ✅ No errors
- ✅ Styling visible

---

## 🔍 What Changed

| Issue | Old Version | New Version | Fix |
|-------|------------|------------|-----|
| Upload artifact | v2 | v3 | Updated to latest |
| Deploy pages | v2 | v4 | Updated to latest |
| Configure pages | v4 | v5 | Updated to latest |
| Cache management | - | npm | Better caching |
| Install | npm install | npm ci | More reliable |

---

## ✨ If It Still Fails

Check the **error message** in Actions logs:

1. Go to **Actions** tab
2. Click the failed build
3. Click **Set up job** (red X)
4. Scroll down to see the actual error
5. Common fixes:
   - **Cache error**: Try running manually (click "Run workflow")
   - **Build error**: Check if `npm run build` works locally
   - **Permissions error**: Check Settings → Actions permissions are enabled

---

## 🧪 Test Everything After Success

### Test 1: Frontend Loads
```
https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
```
Should show landing page ✅

### Test 2: Backend Health Check
```
https://erp-api-pr9p.onrender.com/health
```
Should return JSON ✅

### Test 3: API Connection
1. Go to frontend
2. Press F12 → Network tab
3. Click Login
4. Request should go to `https://erp-api-pr9p.onrender.com/api/auth/login` ✅
5. Should NOT see CORS error

---

## 📝 Quick Checklist

- ⬜ Delete old workflow file
- ⬜ Create new `.github/workflows/pages-deploy.yml`
- ⬜ Paste the updated code above
- ⬜ Commit
- ⬜ Wait for Actions to complete (green ✅)
- ⬜ Visit site and verify content shows (not white!)
- ⬜ Test backend health check works
- ⬜ Test API calls from frontend

---

**Do this now and your project will be live! 🚀**
