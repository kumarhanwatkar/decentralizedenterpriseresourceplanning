import app from './app';
import { config } from './config/environment';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { initializePayrollScheduler, shutdownPayrollScheduler } from './services/payrollScheduler';

const PORT = config.port;
const HOST = config.serverHost;

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Initialize payroll scheduler for streaming earnings
    logger.info('Initializing payroll scheduler...');
    initializePayrollScheduler();

    // Start listening
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running at http://${HOST}:${PORT}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Database: ${config.mongodb.uri}`);
      logger.info(`API Base URL: ${config.apiBaseUrl}`);
      logger.info(`✅ Payroll streaming scheduler active`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      
      // Stop payroll scheduler
      await shutdownPayrollScheduler();
      
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', {
        promise,
        reason,
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
