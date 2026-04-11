/**
 * Payroll Scheduler Service
 * Manages background jobs for payroll streaming
 * Runs earnings updates at specified intervals
 */

import { logger } from '../utils/logger';
import payrollStreamingService, { PAYROLL_CONFIG } from './payrollStreamingService';

interface SchedulerConfig {
  enabled: boolean;
  interval: number; // milliseconds
  batchSize: number;
  maxRetries: number;
}

class PayrollScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private config: SchedulerConfig;
  private cycleCount = 0;
  private lastError: Error | null = null;
  private consecutiveErrors = 0;
  private maxConsecutiveErrors = 5; // Stop after 5 consecutive errors

  constructor(config: Partial<SchedulerConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? PAYROLL_CONFIG.STREAMING_ENABLED,
      interval: config.interval ?? PAYROLL_CONFIG.UPDATE_INTERVAL,
      batchSize: config.batchSize ?? PAYROLL_CONFIG.BATCH_SIZE,
      maxRetries: config.maxRetries ?? 3,
    };
  }

  /**
   * Start the payroll scheduler
   */
  public start(): boolean {
    if (this.isRunning) {
      logger.warn('Payroll scheduler already running');
      return false;
    }

    if (!this.config.enabled) {
      logger.warn('Payroll scheduler is disabled');
      return false;
    }

    logger.info(
      `Starting payroll scheduler (interval: ${this.config.interval}ms, batch size: ${this.config.batchSize})`
    );

    this.isRunning = true;
    this.cycleCount = 0;
    this.consecutiveErrors = 0;
    this.lastError = null;

    // Run immediately, then at specified intervals
    this.executePayrollCycle();

    this.intervalId = setInterval(() => {
      this.executePayrollCycle();
    }, this.config.interval);

    logger.info('Payroll scheduler started successfully');
    return true;
  }

  /**
   * Stop the payroll scheduler
   */
  public stop(): boolean {
    if (!this.isRunning) {
      logger.warn('Payroll scheduler is not running');
      return false;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    logger.info(`Payroll scheduler stopped after ${this.cycleCount} cycles`);

    return true;
  }

  /**
   * Check if scheduler is running
   */
  public isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Execute a single payroll processing cycle
   */
  private async executePayrollCycle(): Promise<void> {
    try {
      this.cycleCount++;

      // Process all active employees' earnings
      const result = await payrollStreamingService.processAllActiveEmployeesEarnings();

      // Reset error counter on success
      this.consecutiveErrors = 0;
      this.lastError = null;

      // Log every Nth cycle to avoid log spam (log every 60 cycles = 60 seconds at 1s interval)
      if (this.cycleCount % 60 === 0) {
        logger.debug(
          `Payroll cycle #${this.cycleCount}: Processed=${result.processed}, ` +
          `Errors=${result.errors}, TotalEarnings=$${result.totalEarnings.toFixed(2)}`
        );
      }
    } catch (error) {
      this.consecutiveErrors++;
      this.lastError = error instanceof Error ? error : new Error(String(error));

      logger.error(
        `Payroll cycle #${this.cycleCount} failed (${this.consecutiveErrors}/${this.maxConsecutiveErrors}):`,
        error
      );

      // Stop scheduler if too many consecutive errors
      if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
        logger.error(
          `Payroll scheduler stopping due to ${this.consecutiveErrors} consecutive errors`
        );
        this.stop();
      }
    }
  }

  /**
   * Get scheduler status
   */
  public getStatus(): {
    isRunning: boolean;
    cycleCount: number;
    interval: number;
    batchSize: number;
    lastError: Error | null;
    consecutiveErrors: number;
  } {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      interval: this.config.interval,
      batchSize: this.config.batchSize,
      lastError: this.lastError,
      consecutiveErrors: this.consecutiveErrors,
    };
  }

  /**
   * Update scheduler config
   */
  public updateConfig(config: Partial<SchedulerConfig>): boolean {
    if (this.isRunning) {
      logger.warn('Cannot update config while scheduler is running. Stop it first.');
      return false;
    }

    this.config = {
      ...this.config,
      ...config,
    };

    logger.info('Payroll scheduler config updated:', this.config);
    return true;
  }

  /**
   * Reset scheduler
   */
  public reset(): void {
    this.stop();
    this.cycleCount = 0;
    this.consecutiveErrors = 0;
    this.lastError = null;
    logger.info('Payroll scheduler reset');
  }
}

// Create singleton instance
let schedulerInstance: PayrollScheduler | null = null;

/**
 * Get or create the payroll scheduler instance
 */
export const getPayrollScheduler = (
  config?: Partial<SchedulerConfig>
): PayrollScheduler => {
  if (!schedulerInstance) {
    schedulerInstance = new PayrollScheduler(config);
  }
  return schedulerInstance;
};

/**
 * Initialize payroll scheduler on app startup
 * Call this in your main server.ts or app initialization
 */
export const initializePayrollScheduler = (
  config?: Partial<SchedulerConfig>
): PayrollScheduler => {
  const scheduler = getPayrollScheduler(config);

  // Only start if not already running
  if (!scheduler.isActive()) {
    scheduler.start();
  }

  return scheduler;
};

/**
 * Gracefully shutdown the payroll scheduler
 * Call this when shutting down the app
 */
export const shutdownPayrollScheduler = async (): Promise<void> => {
  if (schedulerInstance) {
    schedulerInstance.stop();
    logger.info('Payroll scheduler shut down');
  }
};

export default PayrollScheduler;
