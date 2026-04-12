# 🧪 Full-Stack Testing & Integration Guide

## Overview

The system has been set up with:
- ✅ **Backend API** deployed on Render (https://erp-api-pr9p.onrender.com)
- ✅ **Frontend** built with Vite React (ready for GitHub Pages)
- ✅ **API Integration Layer** with axios + services
- ✅ **Mock Data** in frontend context for immediate use
- ✅ **Database Seeding** endpoint (calls /api/admin/seed)

---

## How It Works

### Data Flow Architecture

```
Step 1: User Action on Website
    ↓
Step 2: Frontend calls API via axios
    ↓
Step 3: Backend API processes request
    ↓
Step 4: Backend queries/updates MongoDB
    ↓
Step 5: Response sent back to frontend
    ↓
Step 6: Frontend state updates
    ↓
Step 7: UI re-renders with new data
```

### Three System States

| State | What Happens |
|-------|--------------|
| **Backend Available** | Real API calls → MongoDB → Live data |
| **Backend Down** | Mock data from frontend context → No persistence |
| **First Load** | Uses mock data → Attempts async sync with backend |

---

## 🧹 Clear & Reseed: Database Maintenance

### Option 1: Online Seeding (Via Frontend)

Once deployed, from your website (or browser console):

```typescript
// In browser console (F12 → Console tab)
fetch('https://erp-api-pr9p.onrender.com/api/admin/seed', {
  method: 'POST',
  headers: {
    'x-seed-key': 'seed_secret_key_12345',
    'Content-Type': 'application/json'
  },
  body: '{}'
})
.then(r => r.json())
.then(data => console.log('✅ Database seeded:', data))
.catch(err => console.log('❌ Error:', err))
```

### Option 2: Via PowerShell (Local)

```powershell
$uri = "https://erp-api-pr9p.onrender.com/api/admin/seed"
$headers = @{
    "x-seed-key" = "seed_secret_key_12345"
    "Content-Type" = "application/json"
}
$response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body "{}"
Write-Output $response | ConvertTo-Json
```

### Option 3: Via cURL

```bash
curl -X POST "https://erp-api-pr9p.onrender.com/api/admin/seed" \
  -H "x-seed-key: seed_secret_key_12345" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Expected Seeded Data

```
✅ 1 Admin User
  - Email: admin@erp.com
  - Wallet: 0x1234567890123456789012345678901234567890

✅ 3 Employee Users
  1. Alex Johnson (alex@company.com)
  2. Sarah Chen (sarah@company.com)
  3. Mike Davis (mike@company.com)

✅ 4 Employee Records (with payroll/wallet info)

✅ 5 Resources
  - Server Node 1
  - GPU Cluster
  - Load Balancer
  - Database Server
  - Development Workstation

✅ 4 Transactions
  - Payroll transactions
  - Yield distributions
  - Fund transfers

✅ 1 Settings Configuration

✅ 1 AI Configuration with widgets
```

---

## 🧪 Testing Real-Time Sync

### Test 1: Check Backend Connectivity

```javascript
// In browser console
fetch('https://erp-api-pr9p.onrender.com/health')
  .then(r => r.json())
  .then(d => {
    console.log('✅ Backend Status:', d);
    console.log('Environment:', d.environment);
    console.log('Timestamp:', d.timestamp);
  })
```

**Expected Result:**
```json
{
  "status": "Server is running",
  "timestamp": "2026-04-12T15:30:45.123Z",
  "environment": "development"
}
```

### Test 2: Fetch Employees

```javascript
// In browser console
fetch('https://erp-api-pr9p.onrender.com/api/employees')
  .then(r => r.json())
  .then(d => {
    console.log('✅ Employees fetched:', d);
    console.log('Count:', d.length);
    d.forEach(e => console.log(`  - ${e.firstName} ${e.lastName} (${e.department})`));
  })
  .catch(e => console.log('❌ Error:', e.message))
```

**Expected Result:**
```
✅ Employees fetched: Array(4)
Count: 4
  - Admin User (Administration)
  - Alex Johnson (Engineering)
  - Sarah Chen (Product)
  - Mike Davis (Operations)
```

### Test 3: Fetch Resources

```javascript
// In browser console
fetch('https://erp-api-pr9p.onrender.com/api/resources')
  .then(r => r.json())
  .then(d => {
    console.log('✅ Resources fetched:', d);
    console.log('Count:', d.length);
    d.forEach(r => console.log(`  - ${r.name} (${r.status}): ${r.utilization}% utilized`));
  })
```

### Test 4: Create New Employee

```javascript
// In browser console
const newEmployee = {
  employeeId: 'EMP005',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@company.com',
  department: 'Engineering',
  hourlyRate: 60
};

fetch('https://erp-api-pr9p.onrender.com/api/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newEmployee)
})
.then(r => r.json())
.then(d => console.log('✅ Employee created:', d))
.catch(e => console.log('❌ Error:', e.message))
```

---

## 🎵 Real-Time Monitoring

### View Live Render Logs

1. Go to: https://dashboard.render.com/services/srv-dxxx/events
2. Click **Logs** on the left sidebar
3. Watch logs as you make requests:
   ```
   [INFO] GET /api/employees - 200 OK
   [INFO] Database query returned 4 employees
   [INFO] Response sent in 45ms
   ```

### Monitor Network Requests (Browser)

1. Open browser DevTools: **F12**
2. Go to **Network** tab
3. Make a request on the website
4. Click on the API call (e.g., `/api/employees`)
5. See request/response details

---

## 🚀 End-to-End Workflow Test

### Scenario: Create New Dashboard via AI Config

**What Should Happen:**

1. **Admin clicks** "Create Dashboard" in AI Config section
2. **Frontend sends** POST request to `/api/ai-config`
3. **Backend validates** and saves to MongoDB
4. **Database returns** new config ID
5. **Frontend updates** UI with success message
6. **Dashboard appears** in list
7. **Logs show**: Creation timestamp, user, widget count

**Test Steps:**

```javascript
// Step 1: Prepare dashboard config
const dashboardConfig = {
  organizationName: "TechForge Inc",
  description: "New AI-generated dashboard",
  rawInput: "Show payroll overview with recent transactions",
  widgets: [
    {
      id: "w1",
      type: "stat_card",
      title: "Total Payroll",
      position: { row: 0, col: 0 },
      size: { width: 2, height: 1 },
      dataSource: "payroll",
      configuration: { metric: "total", color: "green" }
    },
    {
      id: "w2",
      type: "table",
      title: "Recent Transactions",
      position: { row: 1, col: 0 },
      size: { width: 4, height: 2 },
      dataSource: "transactions",
      configuration: { limit: 10 }
    }
  ],
  layout: "grid",
  gridColumns: 4
};

// Step 2: Create via API
fetch('https://erp-api-pr9p.onrender.com/api/ai-config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dashboardConfig)
})
.then(r => r.json())
.then(data => {
  console.log('✅ Dashboard Created!');
  console.log('ID:', data._id);
  console.log('Name:', data.organizationName);
  console.log('Widgets:', data.widgets.length);
  console.log('Status:', data.status);
});
```

**Verify in Render Logs:**
```
[INFO] POST /api/ai-config - 201 Created
[INFO] Dashboard saved with ID: xxx
[INFO] Widgets processed: 2
[INFO] Response sent
```

---

## 🔍 Common Issues & Fixes

### Issue 1: "Cannot connect to backend"

**Causes:**
- Render server is cold-starting
- Firebase blocked/offline
- Local network issue

**Fix:**
```javascript
// Test backend status
async function checkBackend() {
  try {
    const res = await fetch('https://erp-api-pr9p.onrender.com/health');
    console.log(res.status === 200 ? '✅ Backend OK' : '❌ Backend returned ' + res.status);
  } catch (e) {
    console.log('❌ Cannot reach backend:', e.message);
  }
}
checkBackend();
```

### Issue 2: "API calls working but data not persisting"

**Causes:**
- Seed endpoint not called
- Database not seeded
- Mock data being used instead

**Fix:**
1. Call the seed endpoint (see above)
2. Verify data with: `fetch('https://erp-api-pr9p.onrender.com/api/employees').then(r=>r.json()).then(console.log)`
3. If mock data: Check browser console for "Using local data" warning

### Issue 3: "401 Unauthorized on API calls"

**Causes:**
- Need authentication
- Missing Authorization header

**Fix:**
- Most endpoints require admin or auth
- For testing, use the seed endpoint with correct x-seed-key
- For auth endpoints, use wallet login first

---

## 📊 Performance Monitoring

### Check API Response Times

```javascript
async function measurePerformance() {
  const start = window.performance.now();
  
  const res = await fetch('https://erp-api-pr9p.onrender.com/api/employees');
  const data = await res.json();
  
  const end = window.performance.now();
  console.log(`Response time: ${(end - start).toFixed(2)}ms`);
  console.log(`Records returned: ${data.length}`);
}

measurePerformance();
```

### Typical Performance Metrics
- **Backend** response: 50-150ms
- **Database** query: 20-80ms
- **Cold start** (first request): 5-30 seconds
- **Warm requests**: <100ms

---

## ✅ Verification Checklist

Before considering deployment complete, verify:

- [ ] Backend health endpoint responds
- [ ] Employees can be fetched via API
- [ ] Resources can be fetched via API
- [ ] Transactions can be fetched via API
- [ ] Can create new employee via API
- [ ] Can create AI config via API
- [ ] Data persists in MongoDB
- [ ] Frontend UI updates in real-time
- [ ] Error handling works (shows local data on failure)
- [ ] Environment variables correct (.env.local)
- [ ] GitHub Pages deploy ready
- [ ] Render logs show successful requests

---

## 🎯 Next Steps

1. **Test seed endpoint** - Populate database with example data
2. **Enable GitHub Pages** - Deploy frontend
3. **Test full workflow** - Create data via website, verify in backend
4. **Monitor logs** - Check Render dashboard for issues
5. **Performance tune** - Optimize if needed

---

**Status**: Ready for testing  
**Backend**: Live at https://erp-api-pr9p.onrender.com  
**Frontend**: Ready for GitHub Pages deployment  
**Last Updated**: 2026-04-12
