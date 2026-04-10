/**
 * Payroll Streaming Controller
 * Handles HTTP requests for payroll streaming operations
 */

import { Request, Response } from 'express';
import payrollStreamingService from '../services/payrollStreamingService';
import { getPayrollScheduler } from '../services/payrollScheduler';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export const payrollStreamingController = {
  /**
   * Get streaming status for all active employees
   * @route GET /api/payroll/status
   */
  getStreamingStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await payrollStreamingService.getStreamingStats();

      res.status(200).json({
        success: true,
        data: stats,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get streaming status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch streaming status',
        statusCode: 500,
      });
    }
  },

  /**
   * Get detailed streaming info for a specific employee
   * @route GET /api/payroll/:employeeId/streaming
   */
  getEmployeeStreamingDetails: async (req: Request, res: Response): Promise<void> => {
    try {
      const { employeeId } = req.params;

      const details = await payrollStreamingService.getEmployeeStreamingDetails(
        employeeId
      );

      if (!details) {
        throw new NotFoundError('Employee');
      }

      res.status(200).json({
        success: true,
        data: details,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get streaming details error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch streaming details',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Start streaming for an employee
   * @route POST /api/payroll/:employeeId/start-streaming
   */
  startStreaming: async (req: Request, res: Response): Promise<void> => {
    try {
      const { employeeId } = req.params;

      const success = await payrollStreamingService.startEmployeeStreaming(
        employeeId
      );

      if (!success) {
        throw new NotFoundError('Employee');
      }

      res.status(200).json({
        success: true,
        message: 'Payroll streaming started',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Start streaming error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to start streaming',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Stop streaming for an employee
   * @route POST /api/payroll/:employeeId/stop-streaming
   */
  stopStreaming: async (req: Request, res: Response): Promise<void> => {
    try {
      const { employeeId } = req.params;

      const success = await payrollStreamingService.stopEmployeeStreaming(employeeId);

      if (!success) {
        throw new NotFoundError('Employee');
      }

      res.status(200).json({
        success: true,
        message: 'Payroll streaming stopped',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Stop streaming error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to stop streaming',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Unlock locked earnings for an employee (vesting)
   * @route POST /api/payroll/:employeeId/unlock
   * @body unlockPercentage - Amount to unlock (0-1), default 1.0 (100%)
   */
  unlockEarnings: async (req: Request, res: Response): Promise<void> => {
    try {
      const { employeeId } = req.params;
      const { unlockPercentage = 1.0 } = req.body;

      if (unlockPercentage < 0 || unlockPercentage > 1) {
        throw new ValidationError(
          'unlockPercentage must be between 0 and 1'
        );
      }

      const result = await payrollStreamingService.unlockEmployeeEarnings(
        employeeId,
        unlockPercentage
      );

      if (!result.success) {
        throw new NotFoundError('Employee');
      }

      res.status(200).json({
        success: true,
        data: {
          unlockedAmount: result.unlockedAmount,
          message: `Unlocked $${result.unlockedAmount.toFixed(2)}`,
        },
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Unlock earnings error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          message: error.message,
          statusCode: 400,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to unlock earnings',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Create payment from liquid amount
   * @route POST /api/payroll/:employeeId/create-payment
   * @body amount - Amount to pay out
   */
  createPayment: async (req: Request, res: Response): Promise<void> => {
    try {
      const { employeeId } = req.params;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        throw new ValidationError('Amount must be greater than 0');
      }

      const result = await payrollStreamingService.createPaymentFromLiquid(
        employeeId,
        amount
      );

      if (!result.success) {
        throw new ValidationError('Cannot create payment - insufficient liquid funds');
      }

      res.status(200).json({
        success: true,
        data: {
          amount: amount,
          newLiquidAmount: result.newLiquidAmount,
          newPaidAmount: result.newPaidAmount,
        },
        message: `Payment of $${amount.toFixed(2)} created successfully`,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Create payment error:', error);
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          message: error.message,
          statusCode: 400,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create payment',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Get scheduler status (admin only)
   * @route GET /api/payroll/admin/scheduler-status
   */
  getSchedulerStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const scheduler = getPayrollScheduler();
      const status = scheduler.getStatus();

      res.status(200).json({
        success: true,
        data: {
          ...status,
          uptime: status.cycleCount * (status.interval / 1000), // seconds
        },
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get scheduler status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch scheduler status',
        statusCode: 500,
      });
    }
  },

  /**
   * Start scheduler (admin only)
   * @route POST /api/payroll/admin/scheduler-start
   */
  startScheduler: async (req: Request, res: Response): Promise<void> => {
    try {
      const scheduler = getPayrollScheduler();

      if (scheduler.isActive()) {
        res.status(400).json({
          success: false,
          message: 'Scheduler is already running',
          statusCode: 400,
        });
        return;
      }

      const started = scheduler.start();

      res.status(200).json({
        success: started,
        message: started ? 'Scheduler started' : 'Failed to start scheduler',
        statusCode: started ? 200 : 500,
      });
    } catch (error) {
      logger.error('Start scheduler error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start scheduler',
        statusCode: 500,
      });
    }
  },

  /**
   * Stop scheduler (admin only)
   * @route POST /api/payroll/admin/scheduler-stop
   */
  stopScheduler: async (req: Request, res: Response): Promise<void> => {
    try {
      const scheduler = getPayrollScheduler();

      if (!scheduler.isActive()) {
        res.status(400).json({
          success: false,
          message: 'Scheduler is not running',
          statusCode: 400,
        });
        return;
      }

      const stopped = scheduler.stop();

      res.status(200).json({
        success: stopped,
        message: stopped ? 'Scheduler stopped' : 'Failed to stop scheduler',
        statusCode: stopped ? 200 : 500,
      });
    } catch (error) {
      logger.error('Stop scheduler error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to stop scheduler',
        statusCode: 500,
      });
    }
  },
};
