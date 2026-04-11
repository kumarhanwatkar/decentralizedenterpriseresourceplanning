/**
 * Payroll Streaming Service
 * Handles real-time earnings streaming with 15% liquid / 85% locked distribution
 * Runs background jobs to update employee earnings every second
 */

import Employee from '../models/Employee';
import { logger } from '../utils/logger';

/**
 * Payroll streaming configuration
 */
export const PAYROLL_CONFIG = {
  // Distribution split: 15% liquid (immediate), 85% locked (vesting)
  LIQUID_PERCENTAGE: 0.15,
  LOCKED_PERCENTAGE: 0.85,

  // Base earning per second: hourlyRate / 3600 seconds
  SECONDS_PER_HOUR: 3600,

  // Streaming update interval (in milliseconds)
  // Set to 1000 for 1 second updates, or adjust as needed
  UPDATE_INTERVAL: 1000,

  // Batch size for database updates (how many employees per batch)
  BATCH_SIZE: 100,

  // Enable/disable streaming
  STREAMING_ENABLED: true,
};

/**
 * Calculate earnings for a single second
 * earningsPerSecond = hourlyRate / 3600
 */
export const calculateEarningsPerSecond = (hourlyRate: number): number => {
  return hourlyRate / PAYROLL_CONFIG.SECONDS_PER_HOUR;
};

/**
 * Calculate the liquid portion (15% immediately available)
 */
export const calculateLiquidPortion = (earningsAmount: number): number => {
  return earningsAmount * PAYROLL_CONFIG.LIQUID_PERCENTAGE;
};

/**
 * Calculate the locked portion (85% vesting)
 */
export const calculateLockedPortion = (earningsAmount: number): number => {
  return earningsAmount * PAYROLL_CONFIG.LOCKED_PERCENTAGE;
};

/**
 * Process earnings for a single employee
 * Called every second for each active employee
 *
 * Returns object with accrued amounts
 */
export const processEmployeeEarnings = async (
  employeeId: string,
  timestamp: Date = new Date()
): Promise<{
  success: boolean;
  earningsPerSecond: number;
  liquidAccrued: number;
  lockedAccrued: number;
  totalAccrued: number;
  totalLiquid: number;
  totalLocked: number;
  message?: string;
}> => {
  try {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return {
        success: false,
        earningsPerSecond: 0,
        liquidAccrued: 0,
        lockedAccrued: 0,
        totalAccrued: 0,
        totalLiquid: 0,
        totalLocked: 0,
        message: 'Employee not found',
      };
    }

    // Only stream for active employees
    if (employee.status !== 'active' || !employee.isStreamingActive) {
      return {
        success: false,
        earningsPerSecond: 0,
        liquidAccrued: 0,
        lockedAccrued: 0,
        totalAccrued: 0,
        totalLiquid: employee.liquidAmount || 0,
        totalLocked: employee.lockedAmount || 0,
        message: 'Employee not actively streaming',
      };
    }

    // Calculate earnings for this second
    const earningsPerSecond = calculateEarningsPerSecond(employee.hourlyRate);

    // Split into liquid and locked
    const liquidAccrued = calculateLiquidPortion(earningsPerSecond);
    const lockedAccrued = calculateLockedPortion(earningsPerSecond);

    // Update employee document
    employee.lastStreamedAt = timestamp;
    employee.totalAccrued = (employee.totalAccrued || 0) + earningsPerSecond;
    employee.totalEarned = (employee.totalEarned || 0) + earningsPerSecond;
    employee.liquidAmount = (employee.liquidAmount || 0) + liquidAccrued;
    employee.lockedAmount = (employee.lockedAmount || 0) + lockedAccrued;

    await employee.save();

    return {
      success: true,
      earningsPerSecond,
      liquidAccrued,
      lockedAccrued,
      totalAccrued: employee.totalAccrued,
      totalLiquid: employee.liquidAmount,
      totalLocked: employee.lockedAmount,
    };
  } catch (error) {
    logger.error(`Error processing earnings for employee ${employeeId}:`, error);
    return {
      success: false,
      earningsPerSecond: 0,
      liquidAccrued: 0,
      lockedAccrued: 0,
      totalAccrued: 0,
      totalLiquid: 0,
      totalLocked: 0,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Batch process earnings for all active employees
 * More efficient than processing one at a time
 * Uses aggregation for bulk updates
 */
export const processAllActiveEmployeesEarnings = async (
  timestamp: Date = new Date()
): Promise<{
  success: boolean;
  processed: number;
  skipped: number;
  errors: number;
  totalEarnings: number;
  totalLiquid: number;
  totalLocked: number;
}> => {
  try {
    // Get all active, streaming employees
    const employees = await Employee.find({
      status: 'active',
      isStreamingActive: true,
    })
      .select('hourlyRate lastStreamedAt totalAccrued liquidAmount lockedAmount')
      .lean();

    if (employees.length === 0) {
      return {
        success: true,
        processed: 0,
        skipped: 0,
        errors: 0,
        totalEarnings: 0,
        totalLiquid: 0,
        totalLocked: 0,
      };
    }

    let processed = 0;
    let errors = 0;
    let totalEarnings = 0;
    let totalLiquid = 0;
    let totalLocked = 0;

    // Process in batches to avoid memory issues with large datasets
    for (let i = 0; i < employees.length; i += PAYROLL_CONFIG.BATCH_SIZE) {
      const batch = employees.slice(i, i + PAYROLL_CONFIG.BATCH_SIZE);

      // Prepare bulk operations for this batch
      const bulkOps: any[] = [];

      for (const emp of batch) {
        const earningsPerSecond = calculateEarningsPerSecond(emp.hourlyRate);
        const liquidAccrued = calculateLiquidPortion(earningsPerSecond);
        const lockedAccrued = calculateLockedPortion(earningsPerSecond);

        bulkOps.push({
          updateOne: {
            filter: { _id: (emp as any)._id },
            update: {
              $set: { lastStreamedAt: timestamp },
              $inc: {
                totalAccrued: earningsPerSecond,
                totalEarned: earningsPerSecond,
                liquidAmount: liquidAccrued,
                lockedAmount: lockedAccrued,
              },
            },
          },
        });

        totalEarnings += earningsPerSecond;
        totalLiquid += liquidAccrued;
        totalLocked += lockedAccrued;
      }

      // Execute bulk operations
      try {
        if (bulkOps.length > 0) {
          const result = await Employee.bulkWrite(bulkOps);
          processed += result.modifiedCount;
        }
      } catch (error) {
        logger.error('Error in batch update:', error);
        errors += batch.length;
      }
    }

    logger.info(`Payroll streaming - Processed: ${processed}, Errors: ${errors}, Total earnings: $${totalEarnings.toFixed(2)}`);

    return {
      success: true,
      processed,
      skipped: employees.length - processed - errors,
      errors,
      totalEarnings,
      totalLiquid,
      totalLocked,
    };
  } catch (error) {
    logger.error('Error processing all employee earnings:', error);
    return {
      success: false,
      processed: 0,
      skipped: 0,
      errors: 1,
      totalEarnings: 0,
      totalLiquid: 0,
      totalLocked: 0,
    };
  }
};

/**
 * Start payroll streaming for a specific employee
 */
export const startEmployeeStreaming = async (employeeId: string): Promise<boolean> => {
  try {
    const result = await Employee.findByIdAndUpdate(
      employeeId,
      {
        isStreamingActive: true,
        lastStreamedAt: new Date(),
      },
      { new: true }
    );

    if (result) {
      logger.info(`Started streaming for employee ${employeeId}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Error starting streaming for employee ${employeeId}:`, error);
    return false;
  }
};

/**
 * Stop payroll streaming for a specific employee
 * Useful for pausing payroll without changing status
 */
export const stopEmployeeStreaming = async (employeeId: string): Promise<boolean> => {
  try {
    const result = await Employee.findByIdAndUpdate(
      employeeId,
      { isStreamingActive: false },
      { new: true }
    );

    if (result) {
      logger.info(`Stopped streaming for employee ${employeeId}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Error stopping streaming for employee ${employeeId}:`, error);
    return false;
  }
};

/**
 * Get streaming statistics for all active employees
 */
export const getStreamingStats = async (): Promise<{
  activeStreamers: number;
  inactiveEmployees: number;
  totalLiquidAvailable: number;
  totalLockedAmount: number;
  totalEarned: number;
}> => {
  try {
    const stats = await Employee.aggregate([
      {
        $match: { status: 'active' },
      },
      {
        $group: {
          _id: null,
          activeStreamers: {
            $sum: {
              $cond: ['$isStreamingActive', 1, 0],
            },
          },
          inactiveEmployees: {
            $sum: {
              $cond: ['$isStreamingActive', 0, 1],
            },
          },
          totalLiquidAvailable: { $sum: '$liquidAmount' },
          totalLockedAmount: { $sum: '$lockedAmount' },
          totalEarned: { $sum: '$totalEarned' },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        activeStreamers: 0,
        inactiveEmployees: 0,
        totalLiquidAvailable: 0,
        totalLockedAmount: 0,
        totalEarned: 0,
      };
    }

    return stats[0];
  } catch (error) {
    logger.error('Error getting streaming stats:', error);
    return {
      activeStreamers: 0,
      inactiveEmployees: 0,
      totalLiquidAvailable: 0,
      totalLockedAmount: 0,
      totalEarned: 0,
    };
  }
};

/**
 * Unlock portion of locked amount (e.g., after vesting)
 * Moves amount from lockedAmount to liquidAmount
 */
export const unlockEmployeeEarnings = async (
  employeeId: string,
  unlockPercentage: number = 1.0 // 1.0 = 100%, unlock all
): Promise<{ success: boolean; unlockedAmount: number }> => {
  try {
    if (unlockPercentage < 0 || unlockPercentage > 1) {
      throw new Error('Unlock percentage must be between 0 and 1');
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return { success: false, unlockedAmount: 0 };
    }

    const lockedAmount = employee.lockedAmount || 0;
    const unlockedAmount = lockedAmount * unlockPercentage;

    employee.lockedAmount = lockedAmount - unlockedAmount;
    employee.liquidAmount = (employee.liquidAmount || 0) + unlockedAmount;

    await employee.save();

    logger.info(
      `Unlocked $${unlockedAmount.toFixed(2)} for employee ${employeeId}`
    );

    return {
      success: true,
      unlockedAmount,
    };
  } catch (error) {
    logger.error(`Error unlocking earnings for employee ${employeeId}:`, error);
    return { success: false, unlockedAmount: 0 };
  }
};

/**
 * Create payment from liquid amount
 * Moves from liquidAmount to totalPaid
 */
export const createPaymentFromLiquid = async (
  employeeId: string,
  amount: number
): Promise<{ success: boolean; newLiquidAmount: number; newPaidAmount: number }> => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return { success: false, newLiquidAmount: 0, newPaidAmount: 0 };
    }

    const availableLiquid = employee.liquidAmount || 0;

    if (amount > availableLiquid) {
      throw new Error(`Insufficient liquid funds. Available: $${availableLiquid}`);
    }

    employee.liquidAmount = availableLiquid - amount;
    employee.totalPaid = (employee.totalPaid || 0) + amount;
    employee.pendingAmount = Math.max((employee.pendingAmount || 0) - amount, 0);

    await employee.save();

    logger.info(
      `Payment of $${amount.toFixed(2)} created for employee ${employeeId}`
    );

    return {
      success: true,
      newLiquidAmount: employee.liquidAmount,
      newPaidAmount: employee.totalPaid,
    };
  } catch (error) {
    logger.error(`Error creating payment for employee ${employeeId}:`, error);
    return { success: false, newLiquidAmount: 0, newPaidAmount: 0 };
  }
};

/**
 * Get employee streaming details
 */
export const getEmployeeStreamingDetails = async (employeeId: string): Promise<{
  employeeId: string;
  isStreamingActive: boolean;
  hourlyRate: number;
  earningsPerSecond: number;
  totalEarned: number;
  totalAccrued: number;
  liquidAmount: number;
  lockedAmount: number;
  totalPaid: number;
  lastStreamedAt: Date;
  status: string;
} | null> => {
  try {
    const employee = await Employee.findById(employeeId).select(
      'employeeId isStreamingActive hourlyRate totalEarned totalAccrued liquidAmount lockedAmount totalPaid lastStreamedAt status'
    );

    if (!employee) return null;

    return {
      employeeId: employee.employeeId,
      isStreamingActive: employee.isStreamingActive || false,
      hourlyRate: employee.hourlyRate,
      earningsPerSecond: calculateEarningsPerSecond(employee.hourlyRate),
      totalEarned: employee.totalEarned || 0,
      totalAccrued: employee.totalAccrued || 0,
      liquidAmount: employee.liquidAmount || 0,
      lockedAmount: employee.lockedAmount || 0,
      totalPaid: employee.totalPaid || 0,
      lastStreamedAt: employee.lastStreamedAt || new Date(),
      status: employee.status,
    };
  } catch (error) {
    logger.error(`Error getting streaming details for employee ${employeeId}:`, error);
    return null;
  }
};

export const payrollStreamingService = {
  processEmployeeEarnings,
  processAllActiveEmployeesEarnings,
  startEmployeeStreaming,
  stopEmployeeStreaming,
  getStreamingStats,
  unlockEmployeeEarnings,
  createPaymentFromLiquid,
  getEmployeeStreamingDetails,
};

export default payrollStreamingService;
