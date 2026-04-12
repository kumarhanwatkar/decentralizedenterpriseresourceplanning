# Employee Management REST APIs - Complete Documentation

## Overview

The Employee Management REST APIs provide complete CRUD operations for managing employees in the Decentralized ERP system, with integrated real-time earnings calculation based on hourly rates.

**Key Features:**
- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time earnings accrual tracking
- ✅ Payroll pause/resume functionality
- ✅ Advanced search and filtering
- ✅ Role-based access control (Admin only for modifications)
- ✅ Payroll analytics and reporting
- ✅ Organization-wide statistics

---

## Architecture

### Service Layer (`src/services/employeeService.ts`)

The service layer handles all business logic including:
- Employee CRUD operations
- Real-time earnings calculation
- Payroll state management
- Search and filtering
- Analytics queries

### Controller Layer (`src/controllers/employeeController.ts`)

Controllers handle HTTP requests and map them to service methods:
- Request validation
- Error handling
- Response formatting
- JSDoc documentation

### Routes (`src/routes/employees.ts`)

Routes define API endpoints with:
- Authentication/Authorization middleware
- Input validation
- Proper HTTP methods
- Comprehensive JSDoc

---

## Real-Time Earnings Logic

### Earnings Calculation Algorithm

**Key Formula:**
```
earningsAccrued = (hourlyRate / 3600 seconds) * secondsElapsed
```

**Process:**
1. Get employee's `hourlyRate` (stored in USD)
2. Get `lastStreamedAt` timestamp (or use `startDate` if first calculation)
3. Calculate seconds elapsed since last stream
4. Multiply hourly rate by seconds worked (seconds / 3600 = hours worked)
5. Update `totalAccrued` and `liquidAmount`
6. Set `lastStreamedAt = now`

### Payroll States

| Status | Description | Earnings | Notes |
|--------|-------------|----------|-------|
| **active** | Normal state | Accruing | Default state for employees |
| **paused** | Payroll paused | Not accruing | Final accrual done before status change |
| **on_leave** | Employee on leave | Not accruing | Pauses earnings during leave |
| **terminated** | Employee terminated | Not accruing | `endDate` set, final accrual recorded |

### State Transitions

```
created → active → paused → active (cycle possible)
created → active → on_leave → active (return from leave)
created → active → ... → terminated (final state)
```

---

## API Endpoints

### 1. GET /api/employees

**Get all employees with pagination**

```http
GET /api/employees?page=1&pageSize=20&department=Engineering&status=active
```

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `pageSize` (number, optional) - Items per page, max 100 (default: 20)
- `department` (string, optional) - Filter by department
- `status` (string, optional) - Filter by status (active, on_leave, paused, terminated)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "department": "Engineering",
      "role": "Senior Engineer",
      "hourlyRate": 50,
      "baseSalary": 104000,
      "status": "active",
      "totalAccrued": 1250.75,
      "liquidAmount": 1250.75,
      "totalPaid": 5000,
      "pendingAmount": 100,
      "lastStreamedAt": "2024-01-15T10:30:45.123Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:45Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### 2. GET /api/employees/:id

**Get single employee by MongoDB ID**

```http
GET /api/employees/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "department": "Engineering",
    "role": "Senior Engineer",
    "hourlyRate": 50,
    "baseSalary": 104000,
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "coldWallet": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "hotWallet": "0xfedcbafedcbafedcbafedcbafedcbafedcbafed",
    "status": "active",
    "payrollCycle": "monthly",
    "startDate": "2024-01-01T00:00:00Z",
    "totalAccrued": 1250.75,
    "liquidAmount": 1250.75,
    "totalEarned": 6250.75,
    "totalPaid": 5000,
    "pendingAmount": 100,
    "lastStreamedAt": "2024-01-15T10:30:45.123Z"
  },
  "statusCode": 200
}
```

**Note:** Earnings are updated before returning to ensure real-time values.

---

### 3. POST /api/employees

**Create new employee**

```http
POST /api/employees
Content-Type: application/json
Authorization: Bearer {token}
```

**Required Headers:**
- `Authorization: Bearer {jwt_token}` - Admin user required

**Request Body:**
```json
{
  "employeeId": "EMP002",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "department": "Finance",
  "role": "Financial Analyst",
  "hourlyRate": 45,
  "baseSalary": 93600,
  "walletAddress": "0x2234567890abcdef1234567890abcdef12345679",
  "coldWallet": "0xbcdefabcdefabcdefabcdefabcdefabcdefabce",
  "hotWallet": "0xedcbafedcbafedcbafedcbafedcbafedcbafeda",
  "userId": "507f1f77bcf86cd799439012",
  "payrollCycle": "monthly",
  "walletType": "metamask"
}
```

**Validation Rules:**
- `employeeId` - Must be unique, required
- `email` - Must be unique, valid email format
- `hourlyRate` - Must be >= 0
- `walletAddress` - Valid Ethereum address (0x + 40 hex chars)
- `coldWallet` - Valid Ethereum address
- `hotWallet` - Valid Ethereum address

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "employeeId": "EMP002",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "department": "Finance",
    "role": "Financial Analyst",
    "hourlyRate": 45,
    "status": "active",
    "totalAccrued": 0,
    "liquidAmount": 0,
    "lastStreamedAt": "2024-01-15T10:30:45.123Z",
    "createdAt": "2024-01-15T10:30:45Z"
  },
  "message": "Employee created successfully",
  "statusCode": 201
}
```

**Error Responses:**
```json
// Duplicate employee ID
{
  "success": false,
  "message": "Employee ID already exists",
  "statusCode": 400
}

// Duplicate email
{
  "success": false,
  "message": "Email already exists",
  "statusCode": 400
}

// Missing required field
{
  "success": false,
  "message": "hourlyRate is required",
  "statusCode": 400
}
```

---

### 4. PUT /api/employees/:id

**Update employee details**

```http
PUT /api/employees/507f1f77bcf86cd799439011
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body (all fields optional except `:id`):**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "department": "Engineering",
  "role": "Lead Engineer",
  "hourlyRate": 55,
  "baseSalary": 114400,
  "payrollCycle": "biweekly"
}
```

**Protected Fields** (cannot be updated):
- `employeeId`
- `userId`
- `createdAt`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Smith",
    "hourlyRate": 55,
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Employee updated successfully",
  "statusCode": 200
}
```

---

### 5. PATCH /api/employees/:id/status

**Update employee status with payroll handling**

```http
PATCH /api/employees/507f1f77bcf86cd799439011/status
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "paused"
}
```

**Valid Status Values:**
- `active` - Normal working status
- `on_leave` - Temporarily on leave
- `paused` - Payroll paused
- `terminated` - Employment ended

**Special Behavior by Status:**

| Previous → New | Action |
|---|---|
| active → paused | Final earnings accrual performed |
| paused → active | `lastStreamedAt` reset to now |
| any → on_leave | Earnings stopped |
| any → terminated | `endDate` set, final accrual recorded |

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "employeeId": "EMP001",
    "status": "paused",
    "totalAccrued": 1500.50,
    "liquidAmount": 1500.50,
    "lastStreamedAt": "2024-01-15T11:15:30Z",
    "statusChangeNote": "Payroll paused. Final earnings accrued: $1500.50"
  },
  "message": "Payroll paused. Final earnings accrued: $1500.50",
  "statusCode": 200
}
```

**Error Responses:**
```json
// Invalid status
{
  "success": false,
  "message": "Invalid status. Must be one of: active, on_leave, paused, terminated",
  "statusCode": 400
}

// Employee not found
{
  "success": false,
  "message": "Employee not found",
  "statusCode": 404
}
```

---

### 6. DELETE /api/employees/:id

**Delete employee**

```http
DELETE /api/employees/507f1f77bcf86cd799439011
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "statusCode": 200
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Employee not found",
  "statusCode": 404
}
```

---

### 7. GET /api/employees/search

**Search employees**

```http
GET /api/employees/search?query=john&department=Engineering&status=active&role=Engineer
```

**Query Parameters:**
- `query` (string, optional) - Search term for firstName, lastName, email, employeeId, or department
- `department` (string, optional) - Filter by department
- `status` (string, optional) - Filter by status
- `role` (string, optional) - Filter by role

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "department": "Engineering",
      "role": "Engineer",
      "status": "active"
    }
  ],
  "statusCode": 200
}
```

---

### 8. GET /api/employees/:id/payroll

**Get payroll summary for employee**

```http
GET /api/employees/507f1f77bcf86cd799439011/payroll
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "hourlyRate": 50,
    "totalAccrued": 1250.75,
    "liquidAmount": 1250.75,
    "totalPaid": 5000,
    "pendingAmount": 100,
    "status": "active"
  },
  "statusCode": 200
}
```

---

### 9. GET /api/employees/:id/earnings

**Get earnings report for employee**

```http
GET /api/employees/507f1f77bcf86cd799439011/earnings?startDate=2024-01-01&endDate=2024-01-31
```

**Query Parameters:**
- `startDate` (ISO string, optional) - Period start (default: 30 days ago)
- `endDate` (ISO string, optional) - Period end (default: now)

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "EMP001",
    "periodStart": "2024-01-01T00:00:00Z",
    "periodEnd": "2024-01-31T23:59:59Z",
    "totalEarned": 3775.50,
    "hourlyRate": 50,
    "hoursWorked": 75.51
  },
  "statusCode": 200
}
```

---

### 10. POST /api/employees/:id/pause-payroll

**Pause payroll for employee**

```http
POST /api/employees/507f1f77bcf86cd799439011/pause-payroll
Authorization: Bearer {token}
```

**Behavior:**
- Must be active employee
- Final earnings accrual performed
- Status changed to "paused"
- No more earnings accrue

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "employeeId": "EMP001",
    "status": "paused",
    "totalAccrued": 1500.50
  },
  "message": "Payroll paused successfully",
  "statusCode": 200
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Can only pause payroll for active employees",
  "statusCode": 400
}
```

---

### 11. POST /api/employees/:id/resume-payroll

**Resume payroll for employee**

```http
POST /api/employees/507f1f77bcf86cd799439011/resume-payroll
Authorization: Bearer {token}
```

**Behavior:**
- Must be paused employee
- Status changed to "active"
- `lastStreamedAt` set to current time
- Earnings resume accruing from this point

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "employeeId": "EMP001",
    "status": "active",
    "lastStreamedAt": "2024-01-15T11:30:00Z"
  },
  "message": "Payroll resumed successfully",
  "statusCode": 200
}
```

---

### 12. GET /api/employees/stats/payroll-total

**Get organization-wide payroll statistics**

```http
GET /api/employees/stats/payroll-total
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalActiveEmployees": 45,
    "totalAccrued": 56234.75,
    "totalLiquidAmount": 56234.75,
    "totalPendingPayments": 5000,
    "averageHourlyRate": 48.50
  },
  "statusCode": 200
}
```

---

### 13. GET /api/employees/stats/by-department

**Get employee count by department**

```http
GET /api/employees/stats/by-department
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "department": "Engineering",
      "count": 12
    },
    {
      "department": "Finance",
      "count": 8
    },
    {
      "department": "HR",
      "count": 5
    }
  ],
  "statusCode": 200
}
```

---

## Authentication & Authorization

### Required Headers

All endpoints require:
```http
Authorization: Bearer {jwt_token}
```

### Role-Based Access

| Endpoint | Role | Permission |
|----------|------|-----------|
| GET endpoints | Any authenticated | ✅ Read only |
| POST /employees | Admin | ✅ Create |
| PUT /:id | Admin | ✅ Update |
| PATCH /:id/status | Admin | ✅ Change status |
| DELETE /:id | Admin | ✅ Delete |
| POST /:id/pause-payroll | Admin | ✅ Pause payroll |
| POST /:id/resume-payroll | Admin | ✅ Resume payroll |

### Token Example

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJyb2xlIjoiYWRtaW4ifQ...
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Employee ID not found |
| 500 | Server Error | Internal error |

### Common Error Scenarios

**Employee Not Found:**
```json
{
  "success": false,
  "message": "Employee not found",
  "statusCode": 404
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "hourlyRate must be >= 0",
  "statusCode": 400
}
```

**Unauthorized (Missing Admin Role):**
```json
{
  "success": false,
  "message": "Not authorized to perform this action",
  "statusCode": 403
}
```

---

## Real-Time Earnings Examples

### Example 1: Basic Accrual

**Employee Details:**
- Hourly Rate: $50
- Status: active
- Last Streamed: 2024-01-15 10:00:00 (UTC)

**Calculation at 10:01:00 (60 seconds later):**
```
earningsAccrued = ($50 / 3600) * 60 seconds
earningsAccrued = $0.01389 * 60
earningsAccrued = $0.833...
totalAccrued += $0.833
```

### Example 2: Pause & Resume Cycle

**Timeline:**
- 08:00 - Employee active, lastStreamedAt = 08:00
- 12:00 - Accrue 4 hours: (50/3600)*14400 = $200
- 12:00 - Status changed to "paused", final accrual $200
- 13:00 - Still paused, no accrual
- 14:00 - Resume payroll, lastStreamedAt = 14:00
- 14:01 - Accrue 1 minute: (50/3600)*60 = $0.833

**Result:**
- totalAccrued: $200.833
- Earnings stopped during pause period (1 hour)

### Example 3: Termination

**Timeline:**
- Start: 2024-01-01
- Termination: 2024-01-15 15:30
- Last Stream: 2024-01-15 15:25

**Final Accrual (5 minutes before termination):**
```
earningsAccrued = ($50 / 3600) * 300 seconds
earningsAccrued = $4.167
totalAccrued = accumulated amount + $4.167
status = "terminated"
endDate = 2024-01-15T15:30:00Z
```

---

## Integration Examples

### Frontend Usage (React/TypeScript)

**Get all employees:**
```typescript
const response = await fetch('/api/employees?page=1&department=Engineering', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data, pagination } = await response.json();
```

**Create employee:**
```typescript
const response = await fetch('/api/employees', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    employeeId: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    department: 'Finance',
    hourlyRate: 45,
    ... (other required fields)
  })
});
```

**Update payroll status:**
```typescript
const response = await fetch(`/api/employees/${employeeId}/status`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'paused' })
});
```

**Get payroll summary (for dashboard):**
```typescript
const response = await fetch(`/api/employees/${employeeId}/payroll`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await response.json();
// Display earnings: $data.liquidAmount
```

---

## Testing Checklist

- [ ] Create new employee with all required fields
- [ ] Create employee with duplicate employeeId (should error)
- [ ] Get all employees with pagination
- [ ] Get single employee (earnings updated)
- [ ] Update employee details
- [ ] Change status to "paused" (earnings accrued)
- [ ] Change status back to "active" (lastStreamedAt reset)
- [ ] Delete employee
- [ ] Search employees by name
- [ ] Pause payroll
- [ ] Resume payroll
- [ ] Get payroll summary
- [ ] Get earnings report
- [ ] Check organization-wide stats
- [ ] Verify authorization (non-admin cannot modify)

---

## Summary

The Employee Management REST APIs provide:
✅ Complete employee lifecycle management
✅ Real-time earnings calculation with sub-second precision
✅ Payroll state control (pause/resume)
✅ Advanced search and filtering
✅ Comprehensive analytics
✅ Role-based access control
✅ Production-ready error handling
