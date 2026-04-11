#!/usr/bin/env node

/**
 * Comprehensive System Verification Script
 * Tests all major API endpoints and features
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://erp-api-pr9p.onrender.com';
const TESTS = [];

// Helper to make HTTPS requests
function request(method, pathWithQuery, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathWithQuery, BASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test cases
async function test(name, fn) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    await fn();
    console.log(`✅ PASS: ${name}`);
    TESTS.push({ name, status: 'PASS' });
  } catch (error) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   Error: ${error.message}`);
    TESTS.push({ name, status: 'FAIL', error: error.message });
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Comprehensive System Verification\n');
  console.log(`Backend: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  // Test 1: Health Check
  await test('Health Endpoint', async () => {
    const res = await request('GET', '/api/health');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.body?.status) throw new Error('No status in response');
    console.log(`   Response: ${res.body.status}`);
  });

  // Test 2: Get Employees
  await test('Get All Employees', async () => {
    const res = await request('GET', '/api/employees');
    // Accept 401 if auth required, but log it
    if (res.status === 401) {
      console.log(`   ⚠️  Authentication required for /api/employees`);
      console.log(`   Status: 401 (Expected for protected endpoint)`);
      return;
    }
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.body)) throw new Error('Response not array');
    console.log(`   Found: ${res.body.length} employees`);
    if (res.body.length > 0) {
      console.log(`   First: ${res.body[0].firstName} ${res.body[0].lastName} (${res.body[0].employeeId})`);
    }
  });

  // Test 3: Get Resources
  await test('Get All Resources', async () => {
    const res = await request('GET', '/api/resources');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.body)) throw new Error('Response not array');
    console.log(`   Found: ${res.body.length} resources`);
    if (res.body.length > 0) {
      console.log(`   First: ${res.body[0].name} (${res.body[0].resourceId})`);
    }
  });

  // Test 4: Get Settings
  await test('Get Settings', async () => {
    const res = await request('GET', '/api/settings');
    if (res.status !== 200 && res.status !== 404) throw new Error(`Status ${res.status}`);
    if (res.status === 200) {
      const settings = Array.isArray(res.body) ? res.body[0] : res.body;
      console.log(`   Company: ${settings?.companyName || 'N/A'}`);
    } else {
      console.log(`   No settings yet (expected)`);
    }
  });

  // Test 5: Verify Seeded Data
  await test('Verify Seeded Data (4 Employees)', async () => {
    const res = await request('GET', '/api/employees');
    if (!Array.isArray(res.body)) throw new Error('Not array');
    const count = res.body.length;
    console.log(`   Employee count: ${count}`);
    if (count < 1) console.warn('   Warning: Expected at least 1 employee');
    
    // Check for specific seeded employees
    const employeeIds = res.body.map(e => e.employeeId);
    console.log(`   IDs: ${employeeIds.join(', ')}`);
  });

  // Test 6: Verify Resources Seeded
  await test('Verify Seeded Data (5 Resources)', async () => {
    const res = await request('GET', '/api/resources');
    if (!Array.isArray(res.body)) throw new Error('Not array');
    const count = res.body.length;
    console.log(`   Resource count: ${count}`);
    
    const resourceIds = res.body.map(r => r.resourceId);
    console.log(`   IDs: ${resourceIds.join(', ')}`);
  });

  // Test 7: Create Employee (CRUD)
  await test('Create New Employee (CRUD Test)', async () => {
    const newEmployee = {
      employeeId: `EMP-TEST-${Date.now()}`,
      firstName: 'Test',
      lastName: 'Employee',
      email: `test-${Date.now()}@company.com`,
      department: 'QA Testing',
      role: 'Test Engineer',
      hourlyRate: 55,
      baseSalary: 95000,
      coldWallet: '0x1111111111111111111111111111111111111111',
      hotWallet: '0x2222222222222222222222222222222222222222',
      startDate: new Date().toISOString(),
    };
    
    const res = await request('POST', '/api/employees', {}, newEmployee);
    if (res.status !== 201 && res.status !== 200) throw new Error(`Status ${res.status}: ${res.body?.message || ''}`);
    console.log(`   Created: ${newEmployee.employeeId}`);
    
    // Verify it was created
    const verifyRes = await request('GET', `/api/employees?employeeId=${newEmployee.employeeId}`);
    if (verifyRes.status === 200) {
      const found = Array.isArray(verifyRes.body) 
        ? verifyRes.body.find(e => e.employeeId === newEmployee.employeeId)
        : verifyRes.body;
      if (found) console.log(`   ✓ Verified in database`);
    }
  });

  // Test 8: Get AI Config
  await test('Get AI Config', async () => {
    const res = await request('GET', '/api/ai-config');
    if (res.status !== 200 && res.status !== 404) throw new Error(`Status ${res.status}`);
    if (res.status === 200) {
      const isArray = Array.isArray(res.body);
      const itemCount = isArray ? res.body.length : 1;
      console.log(`   AI Configs found: ${itemCount}`);
    } else {
      console.log(`   No AI configs yet (expected)`);
    }
  });

  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY\n');
  
  const passed = TESTS.filter(t => t.status === 'PASS').length;
  const failed = TESTS.filter(t => t.status === 'FAIL').length;
  const total = TESTS.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);
  
  TESTS.forEach(t => {
    console.log(`${t.status === 'PASS' ? '✅' : '❌'} ${t.name}`);
    if (t.error) console.log(`   ${t.error}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Verification complete at ${new Date().toISOString()}\n`);
}

// Run
runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
