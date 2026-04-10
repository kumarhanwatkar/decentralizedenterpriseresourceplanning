# Payroll Streaming API - OpenAPI Specification

**Version:** 1.0  
**Last Updated:** April 10, 2026  
**Base URL:** `http://localhost:3001/api/payroll`

---

## 📌 Authentication

All endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## 1️⃣ GET /status

Get organization-wide streaming statistics

### Request

```http
GET /api/payroll/status HTTP/1.1
Host: localhost:3001
Authorization: Bearer {token}
Content-Type: application/json
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "activeStreamers": 15,
    "inactiveEmployees": 3,
    "totalLiquidAvailable": 2450.75,
    "totalLockedAmount": 13860.25,
    "totalEarned": 16311.00
  }
}
```

### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**500 Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 2️⃣ GET /:employeeId/streaming

Get detailed streaming information for a specific employee

### Request

```http
GET /api/payroll/EMP001/streaming HTTP/1.1
Host: localhost:3001
Authorization: Bearer {token}
Content-Type: application/json
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| employeeId | string | Yes | Employee ID (MongoDB ObjectId or custom ID) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john@example.com",
    "isStreamingActive": true,
    "hourlyRate": 50,
    "earningsPerSecond": 0.01389,
    "totalEarned": 500.25,
    "totalAccrued": 145.50,
    "liquidAmount": 21.83,
    "lockedAmount": 123.68,
    "totalPaid": 200.00,
    "lastStreamedAt": "2026-04-10T15:30:45.123Z",
    "status": "active",
    "streamingStartedAt": "2026-04-01T09:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid employee ID format"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Employee not found"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## 3️⃣ POST /:employeeId/start-streaming

Start payroll streaming for a specific employee

### Requirements
- **Role:** Admin only
- **Authentication:** Required

### Request

```http
POST /api/payroll/EMP001/start-streaming HTTP/1.1
Host: localhost:3001
Authorization: Bearer {admin-token}
Content-Type: application/json

{}
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| employeeId | string | Yes | Employee ID |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Payroll streaming started for employee EMP001",
  "data": {
    "employeeId": "EMP001",
    "isStreamingActive": true,
    "streamingStartedAt": "2026-04-10T15:35:20.000Z"
  }
}
```

### Error Responses

**403 Forbidden**
```json
{
  "success": false,
  "error": "Only admins can start streaming"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Employee not found"
}
```

**409 Conflict**
```json
{
  "success": false,
  "error": "Streaming is already active for this employee"
}
```

---

## 4️⃣ POST /:employeeId/stop-streaming

Stop payroll streaming for a specific employee

### Requirements
- **Role:** Admin only
- **Authentication:** Required

### Request

```http
POST /api/payroll/EMP001/stop-streaming HTTP/1.1
Host: localhost:3001
Authorization: Bearer {admin-token}
Content-Type: application/json

{}
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| employeeId | string | Yes | Employee ID |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Payroll streaming stopped for employee EMP001",
  "data": {
    "employeeId": "EMP001",
    "isStreamingActive": false,
    "totalEarnedUntilNow": 500.25,
    "liquidAmount": 75.04,
    "lockedAmount": 425.21
  }
}
```

### Error Responses

**403 Forbidden**
```json
{
  "success": false,
  "error": "Only admins can stop streaming"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Employee not found"
}
```

**409 Conflict**
```json
{
  "success": false,
  "error": "Streaming is not active for this employee"
}
```

---

## 5️⃣ POST /:employeeId/unlock

Unlock locked earnings (move from locked to liquid)

### Requirements
- **Role:** Admin only
- **Authentication:** Required

### Request

```http
POST /api/payroll/EMP001/unlock HTTP/1.1
Host: localhost:3001
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "unlockPercentage": 0.5
}
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| employeeId | string | Yes | Employee ID |

### Request Body

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| unlockPercentage | number | Yes | Percentage to unlock | 0 ≤ value ≤ 1 |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Unlocked 50% of locked earnings",
  "data": {
    "employeeId": "EMP001",
    "unlockedAmount": 212.61,
    "newLiquidAmount": 287.65,
    "newLockedAmount": 212.60,
    "timestamp": "2026-04-10T15:40:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "unlockPercentage must be between 0 and 1"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Only admins can unlock earnings"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Employee not found"
}
```

**422 Unprocessable Entity**
```json
{
  "success": false,
  "error": "No locked earnings to unlock"
}
```

---

## 6️⃣ POST /:employeeId/create-payment

Create payment from liquid earnings

### Requirements
- **Role:** Admin only
- **Authentication:** Required

### Request

```http
POST /api/payroll/EMP001/create-payment HTTP/1.1
Host: localhost:3001
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "amount": 100.00
}
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| employeeId | string | Yes | Employee ID |

### Request Body

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| amount | number | Yes | Payment amount | > 0, ≤ liquidAmount |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Payment of $100.00 created successfully",
  "data": {
    "employeeId": "EMP001",
    "amount": 100.00,
    "newLiquidAmount": 187.65,
    "newPaidAmount": 300.00,
    "paymentTimestamp": "2026-04-10T15:45:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "Amount must be greater than 0"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Only admins can create payments"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Employee not found"
}
```

**422 Unprocessable Entity**
```json
{
  "success": false,
  "error": "Insufficient liquid funds. Available: $187.65, Requested: $200.00"
}
```

---

## 7️⃣ GET /admin/scheduler-status

Get payroll scheduler status and metrics (Admin only)

### Requirements
- **Role:** Admin only
- **Authentication:** Required

### Request

```http
GET /api/payroll/admin/scheduler-status HTTP/1.1
Host: localhost:3001
Authorization: Bearer {admin-token}
Content-Type: application/json
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "isRunning": true,
    "cycleCount": 12450,
    "interval": 1000,
    "batchSize": 100,
    "lastError": null,
    "consecutiveErrors": 0,
    "uptime": 12450,
    "lastCycleTime": "2026-04-10T15:50:30.123Z",
    "configuration": {
      "liquidPercentage": 15,
      "lockedPercentage": 85,
      "updateIntervalMs": 1000,
      "batchSize": 100
    }
  }
}
```

### Error Responses

**403 Forbidden**
```json
{
  "success": false,
  "error": "Only admins can view scheduler status"
}
```

**500 Server Error**
```json
{
  "success": false,
  "error": "Failed to retrieve scheduler status"
}
```

---

## 8️⃣ POST /admin/scheduler-start

Start the payroll scheduler (Admin only)

### Requirements
- **Role:** Admin only
- **Authentication:** Required

### Request

```http
POST /api/payroll/admin/scheduler-start HTTP/1.1
Host: localhost:3001
Authorization: Bearer {admin-token}
Content-Type: application/json

{}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Scheduler started successfully",
  "data": {
    "isRunning": true,
    "startTime": "2026-04-10T15:55:00.000Z"
  }
}
```

### Error Responses

**403 Forbidden**
```json
{
  "success": false,
  "error": "Only admins can start the scheduler"
}
```

**409 Conflict**
```json
{
  "success": false,
  "error": "Scheduler is already running"
}
```

**500 Server Error**
```json
{
  "success": false,
  "error": "Failed to start scheduler"
}
```

---

## 9️⃣ POST /admin/scheduler-stop

Stop the payroll scheduler (Admin only)

### Requirements
- **Role:** Admin only
- **Authentication:** Required

### Request

```http
POST /api/payroll/admin/scheduler-stop HTTP/1.1
Host: localhost:3001
Authorization: Bearer {admin-token}
Content-Type: application/json

{}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Scheduler stopped successfully",
  "data": {
    "isRunning": false,
    "stopTime": "2026-04-10T16:00:00.000Z",
    "cyclesRan": 12450,
    "totalUptime": 12450
  }
}
```

### Error Responses

**403 Forbidden**
```json
{
  "success": false,
  "error": "Only admins can stop the scheduler"
}
```

**409 Conflict**
```json
{
  "success": false,
  "error": "Scheduler is not running"
}
```

**500 Server Error**
```json
{
  "success": false,
  "error": "Failed to stop scheduler"
}
```

---

## 🔐 Authorization Levels

### Public (No Auth)
None - all endpoints require authentication

### Employee (Any Authenticated User)
- `GET /status` - View organization totals
- `GET /:employeeId/streaming` - View own streaming details

### Admin
- All endpoints above
- `POST /:employeeId/start-streaming`
- `POST /:employeeId/stop-streaming`
- `POST /:employeeId/unlock`
- `POST /:employeeId/create-payment`
- `GET /admin/scheduler-status`
- `POST /admin/scheduler-start`
- `POST /admin/scheduler-stop`

---

## 📊 Data Models

### Streaming Status Response

```typescript
{
  employeeId: string;
  name: string;
  email: string;
  isStreamingActive: boolean;
  hourlyRate: number;
  earningsPerSecond: number;
  totalEarned: number;
  totalAccrued: number;
  liquidAmount: number;
  lockedAmount: number;
  totalPaid: number;
  lastStreamedAt: Date;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  streamingStartedAt: Date;
}
```

### Scheduler Status Response

```typescript
{
  isRunning: boolean;
  cycleCount: number;
  interval: number;
  batchSize: number;
  lastError: string | null;
  consecutiveErrors: number;
  uptime: number;
  lastCycleTime: Date;
  configuration: {
    liquidPercentage: number;
    lockedPercentage: number;
    updateIntervalMs: number;
    batchSize: number;
  };
}
```

---

## 🧪 cURL Examples

### Get Organization Stats
```bash
curl -X GET http://localhost:3001/api/payroll/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Get Employee Streaming Details
```bash
curl -X GET http://localhost:3001/api/payroll/EMP001/streaming \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Start Streaming for Employee
```bash
curl -X POST http://localhost:3001/api/payroll/EMP001/start-streaming \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Stop Streaming for Employee
```bash
curl -X POST http://localhost:3001/api/payroll/EMP001/stop-streaming \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Unlock 50% of Locked Earnings
```bash
curl -X POST http://localhost:3001/api/payroll/EMP001/unlock \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"unlockPercentage": 0.5}'
```

### Create $100 Payment
```bash
curl -X POST http://localhost:3001/api/payroll/EMP001/create-payment \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.00}'
```

### Get Scheduler Status
```bash
curl -X GET http://localhost:3001/api/payroll/admin/scheduler-status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Start Scheduler
```bash
curl -X POST http://localhost:3001/api/payroll/admin/scheduler-start \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Stop Scheduler
```bash
curl -X POST http://localhost:3001/api/payroll/admin/scheduler-stop \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 📝 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - State conflict (e.g., already streaming) |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |

---

## 🔄 Rate Limiting

Currently **not implemented**. Consider adding:
- 100 requests per minute per user
- 1000 requests per minute per IP

---

## ✅ Version History

### v1.0 (Current)
- Initial release
- 9 endpoints
- Basic streaming functionality
- Admin scheduler management

---

**Generated:** April 10, 2026  
**Status:** ✅ Production Ready
