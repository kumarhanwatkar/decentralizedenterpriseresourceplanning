# Employee Management - Quick Reference Guide

## 📋 Endpoints Quick Reference

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/employees` | ✅ | Any | List employees (paginated) |
| GET | `/employees/stats/payroll-total` | ✅ | Any | Org-wide payroll stats |
| GET | `/employees/stats/by-department` | ✅ | Any | Department statistics |
| GET | `/employees/search` | ✅ | Any | Search employees |
| GET | `/employees/:id` | ✅ | Any | Get single employee |
| GET | `/employees/:id/payroll` | ✅ | Any | Get payroll summary |
| GET | `/employees/:id/earnings` | ✅ | Any | Get earnings report |
| POST | `/employees` | ✅ | Admin | Create employee |
| PUT | `/employees/:id` | ✅ | Admin | Update employee |
| PATCH | `/employees/:id/status` | ✅ | Admin | Change status |
| POST | `/employees/:id/pause-payroll` | ✅ | Admin | Pause payroll |
| POST | `/employees/:id/resume-payroll` | ✅ | Admin | Resume payroll |
| DELETE | `/employees/:id` | ✅ | Admin | Delete employee |

---

## 🎯 Real-Time Earnings Formula

```javascript
earningsAccrued = (hourlyRate / 3600) * secondsElapsed

// Example: $50/hr, 1 hour later
earningsAccrued = ($50 / 3600) * 3600 = $50
```

**Key Points:**
- Updates on every query to active employees
- Stored in `totalAccrued` and `liquidAmount`
- Pauses when status changes to paused/leave/terminated
- Resets tracking timestamp on resume

---

## 📝 Common Request Examples

### Create Employee
```bash
POST /api/employees
{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "department": "Engineering",
  "role": "Engineer",
  "hourlyRate": 50,
  "baseSalary": 104000,
  "walletAddress": "0x1234...",
  "coldWallet": "0xabcd...",
  "hotWallet": "0xfedc...",
  "userId": "507f1f77bcf86cd799439011"
}
```

### List Employees
```bash
GET /api/employees?page=1&pageSize=20&department=Engineering&status=active
```

### Update Status (Pause)
```bash
PATCH /api/employees/507f1f77bcf86cd799439011/status
{
  "status": "paused"
}
```

### Get Payroll Summary
```bash
GET /api/employees/507f1f77bcf86cd799439011/payroll
```

---

## 🏗️ Architecture Overview

```
HTTP Request
    ↓
Routes (employees.ts)
    ↓ [Auth + Validation]
Controller (employeeController.ts)
    ↓ [HTTP ↔ Business Logic]
Service (employeeService.ts)
    ↓ [Business Logic + Calculations]
Model (Employee.ts)
    ↓ [MongoDB Schema]
Database
```

---

## 🔑 Service Layer Methods

### CRUD
```typescript
getAllEmployees(page, pageSize, filters)
getEmployeeById(employeeId)
createEmployee(data)
updateEmployee(employeeId, updates)
deleteEmployee(employeeId)
```

### Search
```typescript
searchEmployees(query, filters)
```

### Payroll
```typescript
getPayrollSummary(employeeId)
pausePayroll(employeeId)
resumePayroll(employeeId)
updateEmployeeStatus(employeeId, status)
```

### Analytics
```typescript
getEarningsReport(employeeId, startDate, endDate)
getActivePayrollTotal()
getEmployeeCountByDepartment()
```

---

## 🗄️ Employee Document Structure

```javascript
{
  _id: ObjectId,
  employeeId: "EMP001",        // Unique
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",   // Unique
  department: "Engineering",
  role: "Engineer",
  hourlyRate: 50,              // $ per hour
  baseSalary: 104000,          // Annual
  payrollCycle: "monthly",
  
  // Wallet
  walletAddress: "0x1234...",
  coldWallet: "0xabcd...",
  hotWallet: "0xfedc...",
  walletType: "metamask",
  
  // Status & Dates
  status: "active",            // active|paused|on_leave|terminated
  startDate: Date,
  endDate: null,
  
  // Earnings (Real-time)
  totalEarned: 5000,
  totalAccrued: 250.50,        // Accrued this period
  liquidAmount: 250.50,        // Available now
  totalPaid: 4750,
  pendingAmount: 0,
  lastStreamedAt: Date,        // For calculations
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚙️ Status Transitions

```
Created → Active (default)
          ↓
    Paused ← → Active  (loop possible)
          ↓
    On_Leave → Active
          ↓
    Terminated (final)
```

**Special Handling:**
- `→ paused`: Final earnings accrual
- `paused → active`: Reset lastStreamedAt
- `→ terminated`: Set endDate, final accrual

---

## ❌ Status Codes

| Code | Scenario |
|------|----------|
| 200 | GET/PUT/PATCH success |
| 201 | POST success |
| 400 | Validation error |
| 404 | Not found |
| 403 | Unauthorized (non-admin) |
| 500 | Server error |

---

## 🔒 Authorization

**All Endpoints Require:** JWT token in `Authorization: Bearer {token}` header

**Read Endpoints:** Any authenticated user
**Write Endpoints:** Admin role required

---

## 🛡️ Validation Rules

| Field | Rules |
|-------|-------|
| employeeId | Required, unique, string |
| email | Required, unique, valid email |
| hourlyRate | Required, ≥ 0 |
| walletAddress | Valid Ethereum address (0x + 40 hex) |
| status | Must be: active, paused, on_leave, terminated |

---

## 📊 Response Format

**Success:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "statusCode": 200
}
```

**Pagination (List endpoints):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## 🚀 Integration Examples

### React Hook for Listing
```typescript
const [employees, setEmployees] = useState([]);

useEffect(() => {
  fetch('/api/employees', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(data => setEmployees(data.data));
}, [token]);
```

### Create Employee
```typescript
const createEmp = async (data) => {
  const res = await fetch('/api/employees', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
};
```

### Get Real-Time Earnings
```typescript
const getPayroll = async (empId) => {
  const res = await fetch(`/api/employees/${empId}/payroll`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { data } = await res.json();
  return data.liquidAmount; // Current available earnings
};
```

---

## 📄 Update Fields (PUT)

**Can Update:**
- firstName, lastName
- department, role
- hourlyRate, baseSalary
- payrollCycle
- walletType

**Cannot Update:**
- employeeId (protected)
- userId (protected)
- walletAddress (protected)
- createdAt, updatedAt (auto)

---

## 🔍 Search Examples

```bash
# Search by name
GET /employees/search?query=john

# Search by department
GET /employees/search?department=Engineering

# Search by role
GET /employees/search?role=Engineer

# Combine filters
GET /employees/search?query=john&department=Engineering&status=active
```

---

## 💰 Earnings Examples

**Scenario: $50/hr employee working**

After 1 minute: `$50 ÷ 3600 × 60 = $0.833`
After 1 hour: `$50 ÷ 3600 × 3600 = $50.00`
After 8 hours: `$50 × 8 = $400.00`

---

## ✅ Testing Checklist

- [ ] Create employee
- [ ] List employees with pagination
- [ ] Search by name/department
- [ ] Update employee details
- [ ] Get earnings (should increase over time)
- [ ] Pause payroll
- [ ] Resume payroll
- [ ] Check status prevented pause
- [ ] Delete employee
- [ ] Verify admin-only endpoints
- [ ] Check error responses
- [ ] Org-wide payroll stats

---

## 📞 Common Issues & Solutions

**"Duplicate key employeeId"**
- Each employee needs unique employeeId
- Check database for existing value

**"Invalid Ethereum address"**
- Must be 0x followed by 40 hex characters
- Example: 0x1234567890abcdef1234567890abcdef12345678

**"Not authorized"**
- Missing admin role for write operation
- Check user role in JWT token

**"Earnings not updating"**
- Make sure status is "active"
- The earnings update on fetch, not continuously
- Client must poll the endpoint for real-time updates

---

## 📚 Full Documentation

See `EMPLOYEE_API_DOCUMENTATION.md` for:
- Detailed endpoint specifications
- Request/response examples
- Error scenarios
- Integration guide
- Real-world examples
- Testing checklist

---

## 🔄 Earnings Update Flow

```
GET /employees/:id
    ↓
updateRealTimeEarnings() called
    ↓
Check if status = "active"
    ↓
YES: Calculate (hourlyRate/3600) * secondsElapsed
     Update totalAccrued += amount
     Update liquidAmount += amount
     Set lastStreamedAt = now
     Save to DB
    ↓
Return employee with updated earnings
```

**Frequency:** Called every time employee is fetched
**Storage:** Persisted in MongoDB
**Precision:** Sub-second (millisecond accuracy)

---

## 📌 Key Files

| File | Purpose |
|------|---------|
| `employeeService.ts` | Business logic (600+ lines) |
| `employeeController.ts` | HTTP handlers (350+ lines) |
| `employees.ts` | Routes & endpoints (85 lines) |
| `Employee.ts` | MongoDB schema |
| `types/index.ts` | TypeScript types |
| `EMPLOYEE_API_DOCUMENTATION.md` | Full documentation |

---

## 🎓 Learning Path

1. Understand the real-time earnings formula
2. Learn the status transition logic
3. Review service methods (what/how they work)
4. Study controller handlers (HTTP mapping)
5. Check routes (endpoint definitions)
6. Test with Postman/cURL
7. Integrate in frontend
8. Monitor earnings updates

---

**Last Updated:** January 15, 2024
**Status:** ✅ Production Ready
**Version:** 1.0
