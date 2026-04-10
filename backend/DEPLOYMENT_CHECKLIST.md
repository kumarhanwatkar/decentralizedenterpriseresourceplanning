# Payroll Streaming - Deployment Checklist

**Date:** April 10, 2026  
**Purpose:** Verify all systems working before production deployment  
**Time to Complete:** ~15 minutes

---

## ✅ Pre-Deployment Checks

### 1. Code Review

**Status:** ☐ Completed

- [ ] All 4 core files created without errors
  - `src/services/payrollStreamingService.ts`
  - `src/services/payrollScheduler.ts`
  - `src/controllers/payrollStreamingController.ts`
  - `src/routes/payroll.ts`

- [ ] All 5 files modified correctly
  - `src/models/Employee.ts` - `lockedAmount` + `isStreamingActive` added
  - `src/types/index.ts` - IEmployee interface updated
  - `src/services/index.ts` - Exports added
  - `src/app.ts` - Routes registered
  - `src/server.ts` - Scheduler init/shutdown added

- [ ] TypeScript compilation successful
  ```bash
  npm run build
  # Should complete without errors
  ```

- [ ] No linting errors
  ```bash
  npm run lint
  # Should pass all checks
  ```

---

### 2. Database Schema

**Status:** ☐ Verified

- [ ] Employee model has new fields
  ```bash
  # Connect to MongoDB and check:
  db.employees.findOne()
  # Should show: lockedAmount, isStreamingActive
  ```

- [ ] Indexes created
  ```bash
  db.employees.getIndexes()
  # Should include index on isStreamingActive
  ```

- [ ] No schema conflicts with existing data
  ```bash
  # All existing employees should have:
  # - lockedAmount: 0 (default)
  # - isStreamingActive: false (default)
  ```

---

### 3. Server Startup

**Status:** ☐ Tested

- [ ] Server starts without errors
  ```bash
  npm run dev
  # Should see: "✅ Payroll streaming scheduler active"
  ```

- [ ] Scheduler initializes
  ```bash
  # Check logs for: "Payroll cycle #1: Processed=X"
  ```

- [ ] No console errors
  ```bash
  # Terminal should show clean startup, no red text
  ```

- [ ] Database connection successful
  ```bash
  # Should see: "Connected to MongoDB"
  ```

---

### 4. API Endpoints

**Status:** ☐ All Working

Using Postman or curl, test each endpoint:

#### Endpoint 1: GET /api/payroll/status

```bash
curl -X GET http://localhost:3001/api/payroll/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
- ✅ Status 200
- ✅ Contains `activeStreamers`, `totalLiquidAvailable`, `totalLockedAmount`

- [ ] Endpoint responds correctly
- [ ] Response schema matches documentation
- [ ] No errors in response

---

#### Endpoint 2: GET /api/payroll/:employeeId/streaming

```bash
curl -X GET http://localhost:3001/api/payroll/EMP001/streaming \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
- ✅ Status 200
- ✅ Contains employee streaming details
- ✅ Fields: isStreamingActive, hourlyRate, liquidAmount, lockedAmount

- [ ] Endpoint works with valid ID
- [ ] Endpoint returns 404 for invalid ID
- [ ] Response schema correct

---

#### Endpoint 3: POST /api/payroll/:employeeId/start-streaming

```bash
curl -X POST http://localhost:3001/api/payroll/EMP001/start-streaming \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:**
- ✅ Status 200
- ✅ Returns success message
- ✅ Sets `isStreamingActive` to true

- [ ] Admin can start streaming
- [ ] Non-admin gets 403 error
- [ ] Already streaming returns 409 error

---

#### Endpoint 4: POST /api/payroll/:employeeId/stop-streaming

```bash
curl -X POST http://localhost:3001/api/payroll/EMP001/stop-streaming \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:**
- ✅ Status 200
- ✅ Sets `isStreamingActive` to false
- ✅ Earnings stop accumulating

- [ ] Stops streaming correctly
- [ ] Earnings frozen after stop
- [ ] Can restart after stop

---

#### Endpoint 5: POST /api/payroll/:employeeId/unlock

```bash
curl -X POST http://localhost:3001/api/payroll/EMP001/unlock \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"unlockPercentage": 0.5}'
```

**Expected:**
- ✅ Status 200
- ✅ Locked amount decreases
- ✅ Liquid amount increases

- [ ] 50% unlock works
- [ ] 100% unlock works
- [ ] Invalid percentage returns 400
- [ ] Insufficient locked amount returns 422

---

#### Endpoint 6: POST /api/payroll/:employeeId/create-payment

```bash
curl -X POST http://localhost:3001/api/payroll/EMP001/create-payment \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 10}'
```

**Expected:**
- ✅ Status 200
- ✅ Liquid amount decreases
- ✅ Paid amount increases

- [ ] Payment processing works
- [ ] Insufficient funds returns 422
- [ ] Negative amount returns 400

---

#### Endpoint 7: GET /api/payroll/admin/scheduler-status

```bash
curl -X GET http://localhost:3001/api/payroll/admin/scheduler-status \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:**
- ✅ Status 200
- ✅ Contains scheduler status info
- ✅ Shows `isRunning: true`

- [ ] Status endpoint works
- [ ] Non-admin gets 403
- [ ] Shows correct cycle count

---

#### Endpoint 8: POST /api/payroll/admin/scheduler-start

```bash
curl -X POST http://localhost:3001/api/payroll/admin/scheduler-start \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:**
- ✅ Status 200
- ✅ Scheduler starts
- ✅ Cycles resume incrementing

- [ ] Scheduler starts successfully
- [ ] Already running returns 409
- [ ] Logging resumes

---

#### Endpoint 9: POST /api/payroll/admin/scheduler-stop

```bash
curl -X POST http://localhost:3001/api/payroll/admin/scheduler-stop \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:**
- ✅ Status 200
- ✅ Scheduler stops
- ✅ Cycles stop incrementing

- [ ] Scheduler stops successfully
- [ ] Not running returns 409
- [ ] Logging pauses

---

## 🧪 Functional Tests

### Test 1: Streaming Cycle Works

**Steps:**
1. Create new employee with $50/hour
2. Start streaming
3. Wait 1 second
4. Check earnings

**Expected Result:**
```json
{
  "totalEarned": 0.01389,
  "liquidAmount": 0.00208,
  "lockedAmount": 0.01181
}
```

- [ ] Earnings update every second
- [ ] Liquid is ~15% of total
- [ ] Locked is ~85% of total
- [ ] Math checks out

---

### Test 2: Multiple Employees Streaming

**Steps:**
1. Create 5 employees with different hourly rates
2. Start streaming for all 5
3. Wait 5 seconds
4. Check status endpoint

**Expected Result:**
```json
{
  "activeStreamers": 5,
  "totalEarned": "~50+ dollars"
}
```

- [ ] All 5 employees streaming
- [ ] Each has correct earnings
- [ ] Totals add up correctly
- [ ] Database handles batch updates

---

### Test 3: Unlock & Payment Flow

**Steps:**
1. Employee streaming for 1 minute (has earnings)
2. Unlock 50% of locked
3. Create payment for $50
4. Verify final state

**Expected Result:**
```json
{
  "liquidAmount": "increased by 50% of locked",
  "lockedAmount": "decreased by 50%",
  "totalPaid": "increased by $50"
}
```

- [ ] Unlock works correctly
- [ ] Payment deducts from liquid
- [ ] All updates atomic

---

### Test 4: Stop/Start Cycle

**Steps:**
1. Employee streaming for 10 seconds
2. Stop streaming
3. Wait 10 seconds
4. Check earnings (should be same)
5. Start streaming again
6. Wait 10 seconds
7. Check earnings (should increase)

**Expected Result:**
- After stop: Earnings frozen
- After restart: Earnings resume

- [ ] Stop freezes earnings
- [ ] Start resumes correctly
- [ ] No data loss
- [ ] Can cycle multiple times

---

### Test 5: Scheduler Error Recovery

**Steps:**
1. Force an error (e.g., stop DB connection)
2. Wait for scheduler to detect error
3. Reconnect DB
4. Observe recovery

**Expected Result:**
- Error counter increments
- Auto-stops after 5 errors
- Can restart manually

- [ ] Error detection works
- [ ] Auto-stop at 5 errors
- [ ] Can recover after fix
- [ ] Logging shows errors

---

## 🔒 Security Tests

### Test 1: Authentication Required

**Steps:**
```bash
# Try without token
curl -X GET http://localhost:3001/api/payroll/status
```

**Expected:**
- ✅ Status 401
- ✅ Error message present

- [ ] Unauthenticated requests rejected
- [ ] Error message doesn't leak info

---

### Test 2: Authorization Required

**Steps:**
```bash
# Non-admin tries to start scheduler
curl -X POST http://localhost:3001/api/payroll/admin/scheduler-start \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected:**
- ✅ Status 403
- ✅ Forbidden error

- [ ] Non-admin cannot access admin endpoints
- [ ] Non-admin cannot control streaming
- [ ] Admin-only features protected

---

### Test 3: Input Validation

**Steps:**
```bash
# Try invalid unlock percentage
curl -X POST http://localhost:3001/api/payroll/EMP001/unlock \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"unlockPercentage": 1.5}'
```

**Expected:**
- ✅ Status 400
- ✅ Validation error message

- [ ] Invalid percentages rejected
- [ ] Negative amounts rejected
- [ ] Invalid IDs rejected
- [ ] Insufficient funds rejected

---

## 📊 Performance Tests

### Test 1: Bulk Processing

**Steps:**
1. Create 100 employees
2. Start streaming for all
3. Monitor response time

**Expected:**
- Database update completes in < 500ms
- No timeouts
- All 100 records updated

- [ ] Batch processing efficient
- [ ] No memory leaks
- [ ] Database handles capacity

---

### Test 2: Response Times

**Steps:**
```bash
# Measure response time
time curl -X GET http://localhost:3001/api/payroll/status
```

**Expected:**
- `GET /status`: < 200ms
- `GET /streaming`: < 150ms
- `POST /unlock`: < 300ms

- [ ] All endpoints responsive
- [ ] No database bottlenecks
- [ ] API performant

---

### Test 3: Scheduler Load

**Steps:**
1. Monitor CPU/memory during streaming
2. Check database queries
3. Measure cycle times

**Expected:**
- CPU usage < 10%
- Memory stable
- Cycles complete in 100-200ms

- [ ] Scheduler efficient
- [ ] No resource leaks
- [ ] Scalable

---

## 📋 Monitoring Setup

### Test 1: Logging Works

**Steps:**
```bash
# Check logs
tail -f logs/app.log
# Wait 60 seconds for cycle logging
```

**Expected:**
- Logs show every 60 cycles
- Cycle count incrementing
- No error messages

- [ ] Logging configured
- [ ] Cycle logging active
- [ ] Error logging works

---

### Test 2: Error Handling

**Steps:**
1. Trigger various errors (invalid data, DB down, etc.)
2. Observe log messages
3. Verify graceful handling

**Expected:**
- All errors logged
- No crashes
- Appropriate error responses

- [ ] Error logging comprehensive
- [ ] Application doesn't crash
- [ ] Recovery works

---

## 🚀 Pre-Production Sign-Off

**Final Checklist:**

- [ ] All code reviews completed
- [ ] All API endpoints tested
- [ ] All functional tests passed
- [ ] All security tests passed
- [ ] All performance tests passed
- [ ] Monitoring configured
- [ ] Logging verified
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Backup strategy in place
- [ ] Rollback plan prepared

---

## 📞 Deployment Steps

### 1. Deploy Code
```bash
git checkout main
git pull
npm install
npm run build
```

### 2. Verify Database Migration
```bash
# Check Employee model updated
db.employees.findOne()
```

### 3. Start Server
```bash
npm start
# Wait for: "✅ Payroll streaming scheduler active"
```

### 4. Run Health Check
```bash
curl http://localhost:3001/api/payroll/status
```

### 5. Monitor First Hour
```bash
# Watch logs
tail -f logs/app.log
# Watch scheduler status
watch 'curl -s http://localhost:3001/api/payroll/admin/scheduler-status'
```

### 6. Enable Monitoring Alerts
- [ ] Email on errors
- [ ] Slack notifications
- [ ] Dashboard updated
- [ ] Logs centralized

---

## ⏮️ Rollback Plan

**If issues occur:**

1. **Stop scheduler gracefully**
   ```bash
   POST /api/payroll/admin/scheduler-stop
   ```

2. **Revert code**
   ```bash
   git revert {commit_hash}
   npm install
   npm run build
   ```

3. **Restart server**
   ```bash
   npm start
   ```

4. **Verify rollback**
   ```bash
   curl http://localhost:3001/api/payroll/status
   ```

---

## ✅ Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Development Lead | _______ | ______ | _______ |
| QA Lead | _______ | ______ | _______ |
| DevOps | _______ | ______ | _______ |
| Product Owner | _______ | ______ | _______ |

---

**Status:** Ready for Deployment

All systems verified and tested. ✅

Date Completed: _______________  
Deployed By: _______________  
Time: _______________
