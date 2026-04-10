import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logging';

// Routes
import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import payrollRoutes from './routes/payroll';
import transactionRoutes from './routes/transactions';
import resourceRoutes from './routes/resources';
import aiConfigRoutes from './routes/aiConfig';
import settingsRoutes from './routes/settings';

// Initialize express app
const app: Express = express();

// Trust proxy
app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Logging middleware
app.use(requestLogger);
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.logging.format));
}

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai-config', aiConfigRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
