import { Router } from 'express';
import { employeeController } from '../controllers/employeeController';
import { authenticateToken, isAdmin } from '../middleware/authentication';
import { validateRequest, validators } from '../utils/validators';

const router = Router();

// All employee routes require authentication
router.use(authenticateToken);

/**
 * GET /api/employees
 * Get all employees with pagination and optional filters
 */
router.get('/', employeeController.getAll);

/**
 * GET /api/employees/stats/payroll-total
 * Get organization-wide payroll statistics
 */
router.get('/stats/payroll-total', employeeController.getPayrollStats);

/**
 * GET /api/employees/stats/by-department
 * Get employee count by department
 */
router.get('/stats/by-department', employeeController.getEmployeeStats);

/**
 * GET /api/employees/search
 * Search employees by various criteria
 */
router.get('/search', employeeController.search);

/**
 * GET /api/employees/:id
 * Get single employee by ID
 */
router.get('/:id', employeeController.getById);

/**
 * GET /api/employees/:id/payroll
 * Get payroll summary for an employee
 */
router.get('/:id/payroll', employeeController.getPayrollSummary);

/**
 * GET /api/employees/:id/earnings
 * Get earnings report for employee
 */
router.get('/:id/earnings', employeeController.getEarningsReport);

/**
 * POST /api/employees
 * Create new employee (admin only)
 */
router.post(
  '/',
  isAdmin,
  validateRequest(
    validators.requiredString('employeeId'),
    validators.requiredString('firstName'),
    validators.requiredString('lastName'),
    validators.email,
    validators.requiredString('department'),
    validators.hourlyRate
  ),
  employeeController.create
);

/**
 * PUT /api/employees/:id
 * Update employee details (admin only)
 */
router.put('/:id', isAdmin, employeeController.update);

/**
 * PATCH /api/employees/:id/status
 * Update employee status with payroll handling (admin only)
 */
router.patch('/:id/status', isAdmin, employeeController.updateStatus);

/**
 * POST /api/employees/:id/pause-payroll
 * Pause payroll for an employee (admin only)
 */
router.post('/:id/pause-payroll', isAdmin, employeeController.pausePayroll);

/**
 * POST /api/employees/:id/resume-payroll
 * Resume payroll for an employee (admin only)
 */
router.post('/:id/resume-payroll', isAdmin, employeeController.resumePayroll);

/**
 * DELETE /api/employees/:id
 * Delete employee (admin only)
 */
router.delete('/:id', isAdmin, employeeController.delete);

export default router;
