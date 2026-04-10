/**
 * Payroll Streaming Routes
 * Endpoints for managing payroll streaming and payments
 */

import { Router } from 'express';
import { payrollStreamingController } from '../controllers/payrollStreamingController';
import { authenticateToken, isAdmin } from '../middleware/authentication';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/payroll/status
 * Get streaming status for all active employees (any authenticated user)
 */
router.get('/status', payrollStreamingController.getStreamingStatus);

/**
 * GET /api/payroll/:employeeId/streaming
 * Get detailed streaming info for a specific employee (any authenticated user)
 */
router.get('/:employeeId/streaming', payrollStreamingController.getEmployeeStreamingDetails);

/**
 * POST /api/payroll/:employeeId/start-streaming
 * Start streaming for an employee (admin only)
 */
router.post('/:employeeId/start-streaming', isAdmin, payrollStreamingController.startStreaming);

/**
 * POST /api/payroll/:employeeId/stop-streaming
 * Stop streaming for an employee (admin only)
 */
router.post('/:employeeId/stop-streaming', isAdmin, payrollStreamingController.stopStreaming);

/**
 * POST /api/payroll/:employeeId/unlock
 * Unlock locked earnings for an employee (admin only)
 * Body: { unlockPercentage: 0-1 }
 */
router.post('/:employeeId/unlock', isAdmin, payrollStreamingController.unlockEarnings);

/**
 * POST /api/payroll/:employeeId/create-payment
 * Create payment from liquid amount (admin only)
 * Body: { amount: number }
 */
router.post('/:employeeId/create-payment', isAdmin, payrollStreamingController.createPayment);

/**
 * ADMIN ONLY - Scheduler Management Routes
 */

/**
 * GET /api/payroll/admin/scheduler-status
 * Get scheduler status (admin only)
 */
router.get('/admin/scheduler-status', isAdmin, payrollStreamingController.getSchedulerStatus);

/**
 * POST /api/payroll/admin/scheduler-start
 * Start the payroll scheduler (admin only)
 */
router.post('/admin/scheduler-start', isAdmin, payrollStreamingController.startScheduler);

/**
 * POST /api/payroll/admin/scheduler-stop
 * Stop the payroll scheduler (admin only)
 */
router.post('/admin/scheduler-stop', isAdmin, payrollStreamingController.stopScheduler);

export default router;
