# 🔧 FIX: GitHub Actions Build Error - Dependencies Lock File

## Problem You're Seeing

```
Error: Dependencies lock file is not found in 
/home/runner/work/decentralizedenterpriseresourceplanning/...
Supported file patterns: package-lock.json, npm-shrinkwrap.json, yarn.lock
```

This happens because the GitHub Actions workflow is using `npm ci` but the project doesn't commit a lock file (it's in `.gitignore`).

---

## ✅ SOLUTION: Edit Workflow on GitHub (2 minutes)

### STEP 1: Go to Your Workflow File

1. Go to: https://github.com/kumarhanwatkar/decentralizedenterpriseresourceplanning
2. Navigate to: `.github/workflows/pages-deploy.yml`
3. Click the **✏️ Edit** button

---

### STEP 2: Find the Problem Line

Look for this line (around line 31):
```yaml
run: npm ci
```

---

### STEP 3: Change It to

Replace `npm ci` with:
```yaml
run: npm install
```

Your updated section should look like:
```yaml
      - name: Install dependencies
        run: npm install
```

---

### STEP 4: Commit the Fix

1. Scroll to bottom
2. Click **Commit changes**
3. Message: `Fix: Use npm install instead of npm ci`
4. Click **Commit changes**

---

### STEP 5: GitHub Will Auto-Redeploy

1. Go to **Actions** tab
2. Wait for "Deploy Frontend to GitHub Pages" workflow to run
3. Should show ✅ **green checkmark** in 2-3 minutes

---

## 🎉 After Success

Visit: `https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/`

You should see:
- ✅ **Landing page with content** (not white!)
- ✅ Navigation visible
- ✅ No errors in console (F12)

---

## 🧪 Test the Complete Flow

### Test 1: Backend Health
```
https://erp-api-pr9p.onrender.com/health
```
Should return JSON ✅

### Test 2: Frontend Loads
Your site shows with styling ✅

### Test 3: API Connection
1. Click Login
2. Press F12 → Network
3. Try credentials: `admin@example.com` / `123456`
4. API request to `https://erp-api-pr9p.onrender.com/api/auth/login` ✅

---

## Why This Happens

| Component | Status |
|-----------|--------|
| `npm install` | Installs + creates lock file |
| `npm ci` | Installs from existing lock file |
| Your project | No lock file in repo (in .gitignore) |
| GitHub Actions | Fails because `npm ci` needs lock file |

**Solution**: Use `npm install` which works without a pre-existing lock file

---

## Do This Now:

1. ⬜ Edit `.github/workflows/pages-deploy.yml` on GitHub
2. ⬜ Change `npm ci` to `npm install` (line 31)
3. ⬜ Commit changes
4. ⬜ Wait for Actions ✅ (2-3 min)
5. ⬜ Visit your site
6. ⬜ See landing page (not white!)

**Total time: 5 minutes! 🚀**
