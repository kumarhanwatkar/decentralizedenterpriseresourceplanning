# 🚀 Decentralized ERP - Quick Start Guide

Welcome! This guide will get you up and running with both frontend and backend in minutes.

## 📦 What You Have

```
decentralizedenterpriseresourceplanning/
├── Frontend (React + Vite + TypeScript)
│   ├── src/
│   ├── package.json
│   └── README.md
├── Backend (Node.js + Express + MongoDB)
│   ├── src/
│   ├── package.json
│   └── README.md
└── This Quick Start Guide
```

## ⚡ 5-Minute Setup

### Terminal 1: Start Backend

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Wait for: ✅ Server running on http://localhost:5000
```

### Terminal 2: Start MongoDB

```bash
# Option A: Docker (recommended)
docker-compose up -d

# Option B: Local MongoDB
mongod
```

### Terminal 3: Start Frontend

```bash
# Navigate to frontend
cd ..

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Wait for: ✅ Local:   http://localhost:5173
```

## ✅ Verify It's Working

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000
   # Should return: { success: true, message: "Server is healthy" }
   ```

2. **Frontend Running**
   - Open http://localhost:5173 in browser
   - You should see the ERP dashboard

3. **MongoDB Connected**
   - Check backend logs for: `✅ Connected to MongoDB`

## 🎯 First Test: Connect Wallet & Login

1. Open frontend at http://localhost:5173
2. Click **"Connect Wallet"** button
3. MetaMask popup appears → Approve connection
4. Click **"Login"** button
5. Sign the message in MetaMask
6. Dashboard loads with data from backend!

## 📚 Next Steps

### For Frontend Development
- See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for API integration details
- See [frontend/README.md](./frontend/README.md) for frontend-specific docs

### For Backend Development  
- See [backend/README.md](./backend/README.md) for backend docs
- See [BACKEND_SETUP_GUIDE.md](./backend/BACKEND_SETUP_GUIDE.md) for comprehensive guide
- See [backend/.env.example](./backend/.env.example) for all config options

### For Full API Documentation
- See [BACKEND_SETUP_GUIDE.md](./backend/BACKEND_SETUP_GUIDE.md#-api-endpoints)

## 🔧 Common Commands

### Backend
```bash
cd backend

npm run dev          # Start development server
npm run build        # Build for production
npm start           # Run production build
npm test            # Run tests
npm run lint        # Check code style
npm run type-check  # TypeScript validation
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Check code style
npm run test        # Run tests
```

### Docker
```bash
docker-compose up -d      # Start all services
docker-compose down       # Stop all services
docker-compose logs -f    # View logs
```

## 🗂️ Project Structure at a Glance

### Backend
```
backend/src/
├── config/          # Configuration
├── models/          # Database schemas (6 models)
├── controllers/     # Business logic (2 controllers)
├── routes/          # API endpoints (2 route files)
├── middleware/      # Auth, logging, errors
├── utils/           # Helpers & utilities
├── types/           # TypeScript types
├── app.ts           # Express app
└── server.ts        # Server entry
```

### Frontend
```
src/
├── components/      # React components
├── pages/           # Pages (Dashboard, Login, etc)
├── context/         # Context providers (Auth, Theme, Web3)
├── hooks/           # Custom hooks
├── services/        # API services (after integration)
└── lib/             # Utilities
```

## 🔐 Authentication Architecture

```
MetaMask Wallet
    ↓
Frontend: User clicks "Connect & Login"
    ↓
Backend: Receives wallet address & signature
    ↓
Backend: Verifies signature with ethers.js
    ↓
Backend: Generates JWT token
    ↓
Frontend: Stores token in localStorage
    ↓
All future requests include: Authorization: Bearer {token}
    ↓
Backend: Validates token with middleware
    ↓
Access granted or denied
```

## 📊 Database Models

| Model | Purpose |
|-------|---------|
| **User** | Authentication & basic user info |
| **Employee** | Employee data, rates, wallets |
| **Payroll** | Streaming payroll accrual |
| **Transaction** | Blockchain transaction ledger |
| **Resource** | Asset/equipment management |
| **Settings** | Organization configuration |

See [BACKEND_SETUP_GUIDE.md](./backend/BACKEND_SETUP_GUIDE.md#-database-models) for detailed schema info.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/wallet-login` - Login with wallet
- `POST /api/auth/refresh-token` - Refresh JWT
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Employees
- `GET /api/employees` - List all
- `POST /api/employees` - Create new
- `GET /api/employees/:id` - Get one
- `PUT /api/employees/:id` - Update
- `PATCH /api/employees/:id/status` - Update status
- `DELETE /api/employees/:id` - Delete
- `GET /api/employees/search?q=name` - Search

### More coming soon
- Payroll, Transactions, Resources, Settings, etc.

## 🚨 Troubleshooting

### Backend won't start?
```bash
# Check Node version
node --version  # Should be 18 or higher

# Clear dependencies
rm -rf node_modules package-lock.json
npm install

# Check MongoDB
curl http://localhost:27017
```

### CORS errors?
- Backend is configured for `http://localhost:8080` (frontend)
- If using different port, update `FRONTEND_URL` in `.env.local`

### Port already in use?
```bash
# Change port in backend/.env.local
PORT=5001

# Or kill process using port 5000
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows (find PID and kill)
```

### Login not working?
1. Ensure MetaMask is installed: https://metamask.io
2. Switch to test network (e.g., BSC Testnet)
3. Check console for errors: DevTools (F12) → Console tab
4. Verify backend is running: `curl http://localhost:5000`

## 📈 Performance Tips

- Frontend builds fast (Vite ~100ms)
- Backend auto-reloads on file changes
- MongoDB indexed queries are instant
- JWT tokens cached, minimal DB lookups

## 🔐 Security Notes

- Never commit `.env.local` - it has secrets
- JWT expires in 7 days (configurable)
- Refresh tokens expire in 30 days
- All passwords are bcrypt hashed (if used)
- Wallet signatures verified with ethers.js

## 📱 Mobile/Responsive

Frontend is fully responsive:
- Desktop: Charts, tables, full dashboard
- Tablet: Optimized layout
- Mobile: Touch-friendly, stacked layout

## 🎓 Learning Resources

- **React**: https://react.dev
- **Express**: https://expressjs.com
- **MongoDB**: https://docs.mongodb.com
- **TypeScript**: https://www.typescriptlang.org
- **Ethers.js**: https://docs.ethers.org
- **Vite**: https://vitejs.dev

## 🚀 Deployment Later

When ready for production:

1. **Frontend**: Deploy build to GitHub Pages or Vercel
2. **Backend**: Deploy to Heroku, Railway, or your server
3. **Database**: Use MongoDB Atlas (cloud)
4. **Environment**: Update endpoints for production

See deployment sections in:
- `backend/README.md#-deployment`
- `frontend/README.md` (if available)

## 📞 Need Help?

1. Check [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for frontend issues
2. Check [backend/README.md](./backend/README.md#-troubleshooting) for backend issues
3. Check [BACKEND_SETUP_GUIDE.md](./backend/BACKEND_SETUP_GUIDE.md) for comprehensive docs

## ✨ What's Next After Setup?

### First Week
- [ ] Test all authentication flows
- [ ] Create test employees
- [ ] Verify data persistence
- [ ] Test payroll streaming

### Second Week  
- [ ] Implement remaining controllers (payroll, transactions, etc)
- [ ] Connect frontend to real data
- [ ] Create admin panel
- [ ] Add AI config dashboard

### Third Week
- [ ] Blockchain integration testing
- [ ] Load testing
- [ ] Security audit
- [ ] Production deployment

## 🎉 Ready?

Follow the 5-Minute Setup above, then explore both frontend and backend!

**Happy coding! 🚀**

---

For more details, see the comprehensive guides in the workspace root and subdirectories.
