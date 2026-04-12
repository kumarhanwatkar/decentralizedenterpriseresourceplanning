import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  serverHost: process.env.SERVER_HOST || 'localhost',

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-db',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/erp-test',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-key-to-something-secure',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret:
      process.env.REFRESH_TOKEN_SECRET || 'change-this-refresh-secret-key',
    refreshExpire: process.env.REFRESH_TOKEN_EXPIRE || '30d',
  },

  // Blockchain
  blockchain: {
    network: process.env.BLOCKCHAIN_NETWORK || 'bsc_testnet',
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://data-seed-prebsc-1-b.binance.org:8545',
    smartContractAddress: process.env.SMART_CONTRACT_ADDRESS || '',
    organizationWallet: process.env.ORGANIZATION_WALLET_ADDRESS || '',
  },

  // CORS
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:8080').split(','),
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@techforge.com',
    fromName: process.env.EMAIL_FROM_NAME || 'TechForge ERP',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // Security
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },

  // Feature Flags
  features: {
    aiDashboard: process.env.ENABLE_AI_DASHBOARD === 'true',
    payrollStreaming: process.env.ENABLE_PAYROLL_STREAMING === 'true',
    emailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
    twoFactorAuth: process.env.ENABLE_2FA === 'true',
  },

  // Constants
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];

const validateConfig = () => {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Run validation in production
if (config.nodeEnv === 'production') {
  validateConfig();
}

export default config;
