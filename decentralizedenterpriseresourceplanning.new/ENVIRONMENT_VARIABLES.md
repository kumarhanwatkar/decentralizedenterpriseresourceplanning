# 🔐 Environment Variables: Complete Reference

This guide explains **every** environment variable you'll need - what it is, why you need it, and what value to use.

---

## Environment Variables Explained

An **environment variable** is a configuration value that:
- Lives outside your code
- Changes between environments (dev, staging, production)
- Contains secrets (passwords, API keys)
- Loaded from `.env` files or dashboard

### Why not hardcode?

```typescript
// ❌ BAD - Never do this
const MONGODB_URI = "mongodb+srv://user:password@cluster.mongodb.net/db";
const JWT_SECRET = "super-secret-key";

// If you commit to GitHub, EVERYONE sees your secrets!
// Hackers access your database!
```

```typescript
// ✅ GOOD - Do this
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Values injected at runtime from secure .env file or dashboard
// Secrets never in code!
```

---

## Backend Environment Variables

### Location: `backend/.env`

All these variables go in your local `.env` file (never commit it).

#### Server Configuration

```
NODE_ENV=development
```
- **What**: Tells app if running in development or production
- **Development**: More logging, slower optimization, detailed errors
- **Production**: Less logging, optimized, clean errors
- **Use**: `development` locally, `production` on Render

```
PORT=5000
```
- **What**: Which port your server listens on
- **Why**: So backend responds at `http://localhost:5000`
- **Production**: Can stay 5000 (Render assigns public port automatically)
- **Use**: `5000` (won't change)

```
API_BASE_URL=http://localhost:5000
```
- **What**: Full URL where your backend is accessible
- **Local**: `http://localhost:5000` (your computer)
- **Production**: `https://erp-api-xyz.onrender.com` (Render URL)
- **Why**: For logging, debugging, CORS headers
- **Use**: Match where backend is deployed

```
SERVER_HOST=localhost
```
- **What**: Hostname server binds to
- **Local**: `localhost` (local machine only)
- **Production**: `0.0.0.0` (listen on all interfaces)
- **Use**: `localhost` local, `0.0.0.0` production

---

#### Database Configuration (CRITICAL!)

```
MONGODB_URI=mongodb+srv://erpuser:PASSWORD@cluster.mongodb.net/erp-db?retryWrites=true&w=majority
```
- **What**: Connection string to MongoDB Atlas
- **Format**: `mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE`
- **Where to get**: MongoDB Atlas → Connect → Copy connection string
- **⚠️ MOST IMPORTANT**: Replace `PASSWORD` with your actual password
- **Example**: `mongodb+srv://erpuser:MySecret123@erp-cluster.xxxxx.mongodb.net/erp-db?retryWrites=true&w=majority`
- **Use**: Exact string from MongoDB Atlas (with password filled in)

```
MONGODB_USER=erpuser
```
- **What**: MongoDB database username
- **Where to get**: MongoDB Atlas → Database Access
- **Use**: Whatever you named your database user
- **Default**: `erpuser` (if you followed MongoDB setup)

```
MONGODB_PASSWORD=YOUR_PASSWORD
```
- **What**: MongoDB database password
- **⚠️ CRITICAL**: Same password from MongoDB Atlas
- **Where to get**: MongoDB Atlas → Database Access (when you created user)
- **Safety**: Never share this! Keep it secret!
- **Use**: The password you created for database user

```
MONGODB_TEST_URI=mongodb://localhost:27017/erp-test
```
- **What**: Separate database for running tests
- **Use**: Leave as-is (only for testing, not production)

---

#### Authentication Configuration

```
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this
```
- **What**: Secret key for signing JWT tokens
- **Why**: Validates that login tokens are real (not forged)
- **Requirements**: 
  - Minimum 32 characters long
  - Should be random/unguessable
  - **NEVER commit to GitHub**
- **Generate**: Use a secure random generator
  ```bash
  # In PowerShell:
  [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() * 4)) | Select-Object -First 32
  ```
- **Use**: Random string, 32+ chars

```
JWT_EXPIRE=7d
```
- **What**: How long a JWT token is valid
- **Format**: `7d` = 7 days, `24h` = 24 hours, `1h` = 1 hour
- **Why**: Security - old tokens stop working
- **Use**: `7d` (one week is standard)

```
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-characters-change-this
```
- **What**: Secret for refresh tokens (longer-lived tokens)
- **Why**: Safely extend session without new login
- **Requirements**: Same as JWT_SECRET (32+ chars, random)
- **Use**: Different random string than JWT_SECRET

```
REFRESH_TOKEN_EXPIRE=30d
```
- **What**: How long refresh token works
- **Why**: Refresh tokens last longer than JWT
- **Use**: `30d` (one month is standard)

---

#### Blockchain Configuration (Optional)

```
BLOCKCHAIN_NETWORK=bsc_testnet
```
- **What**: Which blockchain to use
- **Options**: `bsc_testnet`, `bsc_mainnet`, `ethereum`, etc.
- **For this project**: Keep as `bsc_testnet` for testing
- **Use**: `bsc_testnet` (testing)

```
BLOCKCHAIN_RPC_URL=https://data-seed-prebsc-1-b.binance.org:8545
```
- **What**: URL to blockchain node
- **Why**: Your app talks to blockchain through this URL
- **For this project**: BSC testnet URL (for testing)
- **Use**: The provided URL (don't change)

```
SMART_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```
- **What**: Your smart contract address on blockchain
- **For this project**: Can be dummy address if not using blockchain
- **Use**: Leave as dummy `0x000...` or your contract address

```
ORGANIZATION_WALLET_ADDRESS=0x0000000000000000000000000000000000000000
```
- **What**: Your organization's blockchain wallet address
- **For this project**: Can be dummy if not using blockchain
- **Use**: Leave as dummy or your wallet address

```
ORGANIZATION_WALLET_PRIVATE_KEY=
```
- **What**: Private key to sign blockchain transactions
- **⚠️ WARNING**: NEVER EVER commit this!
- **For this project**: Leave empty if not using blockchain
- **Use**: Leave empty or provide only if using blockchain

---

#### Email Configuration

```
SMTP_HOST=smtp.gmail.com
```
- **What**: Email server address
- **For Gmail**: `smtp.gmail.com`
- **For others**: `smtp.outlook.com`, `smtp.maildomain.com`, etc.
- **Use**: Your email provider's SMTP host

```
SMTP_PORT=587
```
- **What**: Port for SMTP connection
- **Common**: `587` (with TLS, recommended), `465` (with SSL)
- **Use**: `587`

```
SMTP_SECURE=false
```
- **What**: Whether to use SSL/TLS
- **false**: Use TLS (more common, port 587)
- **true**: Use SSL (port 465)
- **Use**: `false` for port 587

```
SMTP_USER=your-email@gmail.com
```
- **What**: Email address to send from
- **For Gmail**: Your full Gmail address
- **For Gmail**: Need "App Password" (not regular password)
  - Go to myaccount.google.com → Security
  - Enable 2FA
  - Generate "App Password"
  - Use that here
- **Use**: Your email address

```
SMTP_PASS=your-app-specific-password
```
- **What**: Password for SMTP server
- **For Gmail**: Must be "App Password" (not regular password!)
- **⚠️ CRITICAL**: Never use your actual Gmail password!
- **Use**: App-specific password from Google account

```
EMAIL_FROM=noreply@techforge.com
```
- **What**: Display name for "From" field in emails
- **Why**: Users see this in their inbox
- **Use**: Something like `noreply@yourcompany.com`

```
EMAIL_FROM_NAME=TechForge ERP
```
- **What**: Display name for email sender
- **Why**: Users see this name in their email client
- **Use**: Your company or app name

---

#### CORS Configuration

```
FRONTEND_URL=http://localhost:8080
```
- **What**: URL where frontend runs locally
- **Development**: `http://localhost:8080` or `http://localhost:5173` or `http://localhost:3000`
- **Production**: Your actual frontend URL
- **Use**: Match where frontend is running

```
FRONTEND_URL_PRODUCTION=https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
```
- **What**: Production frontend URL
- **Why**: Backend knows where deployed frontend is
- **Use**: Your actual production frontend URL

```
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000,http://localhost:5173
```
- **What**: Which frontend URLs are allowed to call backend
- **Format**: Comma-separated list of URLs
- **Why**: CORS security (only your frontend can call your backend)
- **Examples**: 
  - Local: `http://localhost:5173,http://localhost:3000`
  - Production: `https://yoursite.github.io,https://api.yoursite.com`
- **Use**: Your frontend URLs, comma-separated

---

#### Rate Limiting

```
RATE_LIMIT_WINDOW_MS=900000
```
- **What**: Time window for rate limiting (in milliseconds)
- **900000 ms**: 15 minutes
- **Why**: Prevent abuse (only X requests per time window)
- **Use**: `900000` (15 minutes is standard)

```
RATE_LIMIT_MAX_REQUESTS=100
```
- **What**: Max requests allowed per user in window
- **100 requests**: In 15 minutes = reasonable
- **Why**: Prevent spam/abuse
- **Use**: `100` (good default)

---

#### OpenAI Configuration (Optional)

```
OPENAI_API_KEY=sk-your-openai-key-here
```
- **What**: API key for OpenAI (ChatGPT, etc.)
- **For this project**: Optional, leave empty if not using
- **Where to get**: https://platform.openai.com/api-keys
- **⚠️ WARNING**: Never commit this!
- **Use**: Leave empty, or provide your key if using AI features

```
OPENAI_MODEL=gpt-4
```
- **What**: Which GPT model to use
- **Options**: `gpt-4`, `gpt-3.5-turbo`, etc.
- **gpt-4**: Most capable, costs more
- **gpt-3.5-turbo**: Cheaper, still very good
- **Use**: `gpt-3.5-turbo` (cost-effective)

---

## Frontend Environment Variables

### Location: `decentralizedenterpriseresourceplanning/.env.local`

Frontend has fewer variables (runs in browser, less sensitive):

```
VITE_API_BASE_URL=http://localhost:5000/api
```
- **What**: URL where backend API is located
- **Local**: `http://localhost:5000/api`
- **Production**: `https://erp-api-xyz.onrender.com/api`
- **Why**: Frontend calls API at this URL
- **Format**: Must include `/api` at end
- **Use**: Update after backend is deployed

---

## Creating `.env` Files

### Step 1: Create Backend `.env`

**File**: `backend/.env`

Copy all variables from above into a file named `.env`. Don't commit it!

```bash
# Command line (PowerShell)
cd backend
notepad .env  # Opens editor
# Paste all variables, fill in your values, save
```

### Step 2: Create Frontend `.env.local`

**File**: `decentralizedenterpriseresourceplanning/.env.local`

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Simple - just that one line!

---

## Environment Differences

### Development (Local `.env`)
```
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://erpuser:PASSWORD@erp-cluster.cluster0.mongodb.net/erp-db
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:5000
```

### Production (Render Dashboard)
```
NODE_ENV=production
PORT=5000 (or auto-assigned)
API_BASE_URL=https://erp-api-xyz.onrender.com
MONGODB_URI=mongodb+srv://erpuser:PASSWORD@erp-cluster.cluster0.mongodb.net/erp-db (same!)
FRONTEND_URL=https://yoursite.github.io
ALLOWED_ORIGINS=https://yoursite.github.io,https://erp-api-xyz.onrender.com
```

**Key differences:**
- NODE_ENV changes
- URLs change (localhost → deployed URLs)
- MongoDB URI stays the same (same database for all environments)
- SMTP settings stay the same

---

## Security Best Practices

### ✅ DO:
```
✅ Use 32+ character random strings for secrets
✅ Store .env in .gitignore (never commit)
✅ Use different secrets for dev and prod
✅ Rotate secrets periodically
✅ Use Render/Railway dashboard for production secrets
✅ Never share .env files
✅ Use environment variables for ALL secrets
```

### ❌ DON'T:
```
❌ Hardcode passwords in code
❌ Commit .env to GitHub
❌ Use same secret in dev and prod
❌ Share/post .env contents
❌ Use obvious/simple passwords (use random)
❌ Reuse passwords across apps
❌ Leave old secrets in code
```

---

## Getting Secret Values

### Generate JWT Secret
```powershell
# PowerShell command:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Object System.Random).Next().ToString() + (New-Guid).ToString() + (Get-Random))) | Select-Object -First 128
```

### Get MongoDB Connection String
1. Go to MongoDB Atlas
2. Click Clusters → Connect
3. Select Drivers → Node.js
4. Copy the connection string
5. Replace `<password>` with your database password

### Get Render API Key
1. Go to Render Dashboard
2. Settings → API Key
3. Copy it

---

## Testing Your Variables

### Local Testing
```bash
# Navigate to backend
cd backend

# Test if variables load
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"

# Should print your MongoDB URI (not error)
```

### Production Testing
On Render:
1. Go to service dashboard
2. Go to Logs tab
3. Look for startup messages showing variables loaded
4. If errors, check Environment tab for missing variables

---

## Common Mistakes

### Mistake 1: Wrong MongoDB password
```
Error: MongoNetworkError: failed to connect
```
Solution: Check password in connection string matches database user password

### Mistake 2: Missing `/api` in frontend VITE_API_BASE_URL
```
Wrong: VITE_API_BASE_URL=http://localhost:5000
Right: VITE_API_BASE_URL=http://localhost:5000/api
```

### Mistake 3: Committed .env to GitHub
```python
# Immediately:
1. Delete credentials in MongoDB/Render
2. Generate new credentials
3. Remove .env from git history:
   git rm --cached .env
   git commit -m "Remove .env file"
   git push
```

### Mistake 4: Using Gmail password instead of App Password
```
Gmail no longer allows regular password
Must use: App-specific password from myaccount.google.com
```

### Mistake 5: Forgotten quotes around values with spaces
```
Wrong: EMAIL_FROM_NAME=TechForge ERP  (breaks)
Right: EMAIL_FROM_NAME="TechForge ERP"
```

---

## Environment Variables Summary Table

| Variable | Local Value | Production Value | Example |
|----------|-------------|------------------|---------|
| NODE_ENV | development | production | production |
| MONGODB_URI | Atlas conn str | Same Atlas str | mongodb+srv://... |
| JWT_SECRET | random 32+ | different random 32+ | aB3xYz... |
| FRONTEND_URL | localhost:5173 | your domain | erp.example.com |
| API_BASE_URL | localhost:5000 | Render URL | api.onrender.com |
| EMAIL_* | Gmail settings | Gmail settings | noreply@... |

---

## You're Ready!

Now you understand every variable:
- ✅ What it is
- ✅ Why you need it
- ✅ What value to use
- ✅ Where to get it
- ✅ Security best practices

**Next**: Follow STEP_BY_STEP_DEPLOYMENT.md with this reference nearby!

When in doubt, come back here and look up the variable. Everything is explained!

🔐 **Remember**: Never commit `.env` files. Secrets safe = system safe!
