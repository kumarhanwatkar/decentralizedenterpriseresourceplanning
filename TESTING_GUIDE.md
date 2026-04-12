# STEP 3: Complete Testing Guide

## ✅ Test 1: Backend Health Check (Immediate)

### What it does
Verifies your Render backend is running and connected to MongoDB.

### How to test

**Option A: Using Browser**
1. Go to: `https://your-render-service.onrender.com/health`
   - Replace `your-render-service` with your actual Render service name
   
2. You should see:
```json
{
  "status": "Server is running",
  "timestamp": "2026-04-12T10:00:00.000Z",
  "environment": "production"
}
```

**Option B: Using PowerShell**
```powershell
# Get your Render URL first, it looks like: erp-api-xyz.onrender.com
curl "https://erp-api-xyz.onrender.com/health"
```

### If it fails
❌ Common errors:
- `Connection refused` → Backend not running (check Render dashboard Logs)
- `DNS error` → Wrong URL (copy from Render dashboard)
- `No response` → Check MONGODB_URI in Render environment (might not be able to connect to DB)

**Fix**: Check Render dashboard → Your service → **Logs** tab

---

## ✅ Test 2: Frontend Loads (5 minutes after GitHub Pages setup)

### What it does
Makes sure your React app loads and displays correctly.

### How to test

1. **Visit your site**:
   ```
   https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
   ```

2. **Look for**:
   - ✅ Landing page appears (not white page)
   - ✅ Text and images visible
   - ✅ Dark mode toggle works (top right)
   - ✅ Navigation menu visible

3. **Check browser console** (F12):
   - Should have NO red errors
   - Some warnings are OK
   - Should see: `[Vite] HMR WebSocket connected`

### If it fails
❌ White page = Check these:

1. **Press F12 → Console tab**
   - Look for RED errors
   - Common: "Cannot find module", "React is not defined"

2. **Press F12 → Network tab**
   - Reload page
   - Look for failed requests (red)
   - Check if index.html loaded (green)

3. **Check GitHub Pages settings**
   - Go to GitHub → Settings → Pages
   - Verify branch is `main` and folder is `/ (root)`
   - Look for green checkmark saying "Your site is live"

---

## ✅ Test 3: Frontend-to-Backend API Connection

### What it does
Verifies your frontend can talk to your backend without CORS errors.

### How to test

1. **Visit frontend**:
   ```
   https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
   ```

2. **Open DevTools** (F12) → **Network tab**

3. **Try to log in**:
   - Click **Login** button
   - Enter test credentials:
     - Email: `admin@example.com`
     - Password: `123456`

4. **Watch Network tab**:
   - Should see request to: `/api/auth/login`
   - Response should show (Status 200 or 401 for wrong password)
   - Should NOT see CORS error

5. **Important file to publish**: Your Render backend URL

### If it fails - CORS Error

You'll see error like:
```
Access to XMLHttpRequest at 'https://xxx.onrender.com/api/auth/login' 
from origin 'https://kumarhanwatkar.github.io' has been blocked 
by CORS policy
```

**Fix**:
1. Go to Render dashboard
2. Select your `erp-backend` service
3. Go to **Environment** tab
4. Find `ALLOWED_ORIGINS`
5. Make sure it contains:
   ```
   https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
   ```
6. Save and wait for redeploy (1-2 minutes)

---

## ✅ Test 4: Full End-to-End Flow (Complete Test)

### Complete user journey:

1. **Open frontend**: https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
   - ✅ Landing page loads with styling

2. **Click Login**
   - ✅ Login page appears
   - ✅ Form is interactive

3. **Try credentials**:
   ```
   Email: admin@example.com
   Password: 123456
   ```
   - ✅ API call succeeds (no CORS error)
   - ✅ Either logs in OR shows error (both mean API worked)

4. **Check Dashboard** (if login successful):
   - ✅ Dashboard loads
   - ✅ Tables have data
   - ✅ Charts render

---

## 📊 Expected Render Service URL

Go to your Render dashboard to find your backend URL:

1. Render dashboard → `erp-backend` service
2. At the top, you'll see: `https://erp-api-XXXXX.onrender.com`
3. Use this URL to test health check

---

## 🎯 Success Checklist

After all 3 tests pass:

- ✅ Backend health check returns JSON
- ✅ Frontend loads at GitHub Pages URL
- ✅ No white page (shows content)
- ✅ No JavaScript errors in console
- ✅ API calls go to correct backend
- ✅ No CORS errors
- ✅ Login page appears
- ✅ API calls work (can attempt login)

---

## 📝 If Something Still Doesn't Work

### Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| White page | CSS/JS not loading | Check base path, refresh cache |
| Backend unreachable | Render service offline | Check Render dashboard → Logs |
| CORS error | `ALLOWED_ORIGINS` missing frontend URL | Update Render environment |
| Login fails | MongoDB not connected | Check `MONGODB_URI` in Render |
| 404 error | Wrong GitHub Pages config | Branch=main, Folder=/root |

---

## 🚀 You're Done When

All tests pass and you can:
1. See your landing page
2. Navigate to login
3. Make API call to backend (even if it fails with auth error, the call reached the backend!)
4. No red errors in console

**Congratulations! Your ERP is live! 🎉**
