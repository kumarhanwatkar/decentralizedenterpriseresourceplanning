#!/usr/bin/env node

/**
 * @file deployment-verify.js
 * @description Verify that all Render deployment prerequisites are met
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Deployment Verification Checklist\n');
console.log('=' .repeat(50));

let issues = [];
let warnings = [];

// Check 1: Frontend .env.production exists
console.log('\n1. Checking frontend environment file...');
if (fs.existsSync(path.join(__dirname, '.env.production'))) {
  const content = fs.readFileSync(path.join(__dirname, '.env.production'), 'utf8');
  if (content.includes('VITE_API_BASE_URL')) {
    console.log('   ✅ .env.production exists with VITE_API_BASE_URL');
  } else {
    issues.push('Frontend .env.production missing VITE_API_BASE_URL');
  }
} else {
  console.log('   ⚠️  .env.production not found (will use development values)');
}

// Check 2: Backend .env.production exists
console.log('\n2. Checking backend environment file...');
if (fs.existsSync(path.join(__dirname, 'backend', '.env.production'))) {
  const content = fs.readFileSync(path.join(__dirname, 'backend', '.env.production'), 'utf8');
  if (content.includes('ALLOWED_ORIGINS')) {
    console.log('   ✅ Backend .env.production exists with ALLOWED_ORIGINS');
  } else {
    issues.push('Backend .env.production missing ALLOWED_ORIGINS');
  }
} else {
  console.log('   ⚠️  Backend .env.production not found');
}

// Check 3: Vite config has proper base path
console.log('\n3. Checking Vite configuration...');
const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
if (viteConfig.includes('VITE_BASE_PATH')) {
  console.log('   ✅ Vite config uses VITE_BASE_PATH variable');
} else {
  warnings.push('Vite config should use VITE_BASE_PATH for flexibility');
}

// Check 4: Backend environment config
console.log('\n4. Checking backend environment configuration...');
const envConfig = fs.readFileSync(path.join(__dirname, 'backend', 'src', 'config', 'environment.ts'), 'utf8');
if (envConfig.includes('split(\',\').map(origin => origin.trim())')) {
  console.log('   ✅ Backend properly trims CORS origins');
} else {
  warnings.push('Backend CORS config might have whitespace issues');
}

// Check 5: render.yaml exists
console.log('\n5. Checking Render configuration...');
if (fs.existsSync(path.join(__dirname, 'render.yaml'))) {
  console.log('   ✅ render.yaml found for Render deployment');
} else {
  console.log('   ⚠️  render.yaml not found (optional, but recommended)');
}

// Check 6: package.json has build scripts
console.log('\n6. Checking frontend build configuration...');
const frontendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
if (frontendPkg.scripts && frontendPkg.scripts.build) {
  console.log(`   ✅ Frontend build script: "${frontendPkg.scripts.build}"`);
} else {
  issues.push('Frontend package.json missing build script');
}

// Check 7: Backend package.json build scripts
console.log('\n7. Checking backend build configuration...');
const backendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend', 'package.json'), 'utf8'));
if (backendPkg.scripts && backendPkg.scripts.build) {
  console.log(`   ✅ Backend build script: "${backendPkg.scripts.build}"`);
} else {
  issues.push('Backend package.json missing build script');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Summary:\n');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Ready for Render deployment.');
} else {
  if (issues.length > 0) {
    console.log('❌ CRITICAL ISSUES:');
    issues.forEach(issue => console.log(`   • ${issue}`));
  }
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(warning => console.log(`   • ${warning}`));
  }
}

console.log('\n' + '='.repeat(50));
console.log('\n📝 Next Steps for Render Deployment:\n');
console.log('1. Update environment variables in Render dashboard:');
console.log('   - VITE_API_BASE_URL (frontend API endpoint)');
console.log('   - ALLOWED_ORIGINS (backend CORS)');
console.log('   - JWT_SECRET, REFRESH_TOKEN_SECRET');
console.log('   - MONGODB_URI');
console.log('');
console.log('2. Ensure GitHub Pages is configured');
console.log('');
console.log('3. Run: npm run build to verify production build works');
console.log('');
console.log('4. Push changes and trigger Render redeployment');
console.log('');
console.log('See RENDER_DEPLOYMENT_FIX.md for detailed instructions.\n');
