# 🚀 Decentralized ERP Backend

Complete Node.js + Express + MongoDB backend for the Decentralized ERP system with wallet-based authentication, JWT tokens, and production-ready APIs.

## 📋 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or cloud)
- npm or yarn

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start MongoDB**
   ```bash
   # Option 1: Using Docker
   docker-compose up -d

   # Option 2: Local MongoDB
   mongod
   ```

4. **Run development server**
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Express middlewares
│   ├── services/         # Business services
│   ├── utils/            # Utilities & helpers
│   ├── types/            # TypeScript types
│   ├── app.ts            # Express app
│   └── server.ts         # Server entry point
├── tests/                # Test files
├── .env.example          # Environment template
├── docker-compose.yml    # Docker setup
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Models

### User (Authentication)
- Wallet address (unique)
- Email, name, role
- Status, login tracking

### Employee
- User reference
- Employee ID, department, role
- Hourly rate, wallets (cold/hot)
- Earnings tracking

### Payroll (Streaming)
- Employee reference
- Cycle info, accrued amounts
- Streaming status, payment frequency

### Transaction (Ledger)
- Blockchain transaction hash
- Type, from/to addresses
- Amount, token, status
- Yield information

### Resource
- Resource ID, type (server/machine/equipment)
- Status, utilization, efficiency
- Location, maintenance tracking

### Settings (Organization)
- Company info
- Payroll cycle, yield percentage
- Blockchain config
- Notification settings

### AI Config
- Generated widgets
- Dashboard layout
- Version tracking

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /wallet-login` - Login with MetaMask
- `POST /refresh-token` - Get new JWT
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout user

### Employees (`/api/employees`)
- `GET /` - List all employees (paginated)
- `POST /` - Create employee (admin only)
- `GET /:id` - Get employee details
- `PUT /:id` - Update employee (admin only)
- `PATCH /:id/status` - Update status (admin only)
- `DELETE /:id` - Delete employee (admin only)
- `GET /search` - Search employees

### Ready to implement:
- `/api/payroll` - Payroll streaming management
- `/api/transactions` - Transaction ledger
- `/api/resources` - Resource management
- `/api/settings` - Organization settings
- `/api/ai-config` - AI dashboard configuration
- `/api/dashboard` - Dashboard data

## 🔐 Authentication Flow

```
1. User connects MetaMask wallet
   ↓
2. Backend generates random message
   ↓
3. User signs message with wallet
   ↓
4. Backend verifies signature
   ↓
5. Generate JWT token & return
   ↓
6. Frontend stores token in localStorage
   ↓
7. Each request includes: Authorization: Bearer <token>
   ↓
8. Backend validates token with JWT middleware
```

## 🚀 Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Access MongoDB through Mongo Express
# Visit http://localhost:8081
```

## 📝 Environment Variables

Key environment variables in `.env.local`:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/erp-db

# JWT
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRE=7d

# Blockchain
BLOCKCHAIN_RPC_URL=https://data-seed-prebsc-1-b.binance.org:8545
SMART_CONTRACT_ADDRESS=0x...

# CORS
FRONTEND_URL=http://localhost:8080
```

See `.env.example` for all available options.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- authController.test.ts

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📦 Dependencies

### Core
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT tokens
- **ethers.js** - Wallet verification

### Development
- **typescript** - Type safety
- **nodemon** - Auto-reload
- **jest** - Testing framework

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Wallet signature verification
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ Rate limiting ready
- ✅ Error handling
- ✅ Logging & monitoring

## 📈 API Response Format

All API responses follow consistent format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message",
  "statusCode": 200
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev only)",
  "statusCode": 400
}
```

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB URI
- [ ] Generate strong JWT secrets
- [ ] Configure production CORS origins
- [ ] Set up error tracking (Sentry)
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Test all endpoints
- [ ] Load testing
- [ ] Security audit

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create erp-backend

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main
```

### Deploy with Docker

```bash
# Build image
docker build -t erp-backend:latest .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=your-db-uri \
  -e JWT_SECRET=your-secret \
  erp-backend:latest
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Follow TypeScript best practices
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Commit changes: `git commit -m "feat: add new feature"`
6. Push to branch: `git push origin feature/new-feature`
7. Open Pull Request

## 📝 API Documentation

Full API documentation available in `BACKEND_SETUP_GUIDE.md`

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongosh

# If using Docker
docker-compose up -d mongodb
```

### Port Already in Use
```bash
# Change PORT in .env.local
PORT=5001
```

### JWT Token Invalid
- Verify JWT_SECRET in environment
- Check token expiration in `.env.local`

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [ethers.js Documentation](https://docs.ethers.org/)

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

For issues and questions:
1. Check existing issues on GitHub
2. Open new issue with detailed description
3. Include error logs and environment info

---

**Happy Coding! 🚀**
