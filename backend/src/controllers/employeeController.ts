import { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employeeService';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { PaginatedResponse } from '../types';

export const employeeController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = Math.min(
        parseInt(req.query.pageSize as string) || 20,
        100
      );
      const department = req.query.department as string | undefined;
      const status = req.query.status as any;

      const data = req.body as any;

      const result = await employeeService.getAllEmployees(page, pageSize, {
        department,
        status,
      });

      const response: PaginatedResponse<any> = {
        success: true,
        data: result.employees,
        pagination: {
          page: result.page,
          pageSize,
          total: result.total,
          totalPages: result.totalPages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Get employees error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch employees',
        statusCode: 500,
      });
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const employee = await employeeService.getEmployeeById(id);

      res.status(200).json({
        success: true,
        data: employee,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get employee error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: 'Employee not found',
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch employee',
          statusCode: 500,
        });
      }
    }
  },
};
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch employee',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Create new employee
   * @route POST /api/employees
   * @body employeeId, firstName, lastName, email, department, role, hourlyRate, baseSalary, walletAddress, coldWallet, hotWallet, userId
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const employee = await employeeService.createEmployee(req.body);

      res.status(201).json({
        success: true,
        data: employee,
        message: 'Employee created successfully',
        statusCode: 201,
      });
    } catch (error) {
      logger.error('Create employee error:', error);
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          message: error.message,
          statusCode: 400,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create employee',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Update employee details
   * @route PUT /api/employees/:id
   * @param id - MongoDB employee ID
   * @body All fields except employeeId, userId, and timestamps
   */
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const employee = await employeeService.updateEmployee(id, updates);

      res.status(200).json({
        success: true,
        data: employee,
        message: 'Employee updated successfully',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Update employee error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update employee',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Update employee status with payroll handling
   * @route PATCH /api/employees/:id/status
   * @param id - MongoDB employee ID
   * @body status - 'active', 'on_leave', 'paused', or 'terminated'
   */
  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new ValidationError('Status is required');
      }

      const result = await employeeService.updateEmployeeStatus(id, status);

      res.status(200).json({
        success: true,
        data: result,
        message: result.statusChangeNote || `Employee status updated to ${status}`,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Update employee status error:', error);
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
          message: 'Failed to update status',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Delete employee
   * @route DELETE /api/employees/:id
   * @param id - MongoDB employee ID
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await employeeService.deleteEmployee(id);

      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Delete employee error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete employee',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Search employees
   * @route GET /api/employees/search
   * @query query - Search term (firstName, lastName, email, employeeId, department)
   * @query department - Filter by department
   * @query status - Filter by status
   * @query role - Filter by role
   */
  search: async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.query as string | undefined;
      const department = req.query.department as string | undefined;
      const status = req.query.status as any;
      const role = req.query.role as string | undefined;

      const employees = await employeeService.searchEmployees(query, {
        department,
        status,
        role,
      });

      res.status(200).json({
        success: true,
        data: employees,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Search employees error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search employees',
        statusCode: 500,
      });
    }
  },

  /**
   * Get payroll summary for an employee
   * @route GET /api/employees/:id/payroll
   * @param id - MongoDB employee ID
   */
  getPayrollSummary: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const summary = await employeeService.getPayrollSummary(id);

      res.status(200).json({
        success: true,
        data: summary,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get payroll summary error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch payroll summary',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Pause payroll for an employee
   * @route POST /api/employees/:id/pause-payroll
   * @param id - MongoDB employee ID
   */
  pausePayroll: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const employee = await employeeService.pausePayroll(id);

      res.status(200).json({
        success: true,
        data: employee,
        message: 'Payroll paused successfully',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Pause payroll error:', error);
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
          message: 'Failed to pause payroll',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Resume payroll for an employee
   * @route POST /api/employees/:id/resume-payroll
   * @param id - MongoDB employee ID
   */
  resumePayroll: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const employee = await employeeService.resumePayroll(id);

      res.status(200).json({
        success: true,
        data: employee,
        message: 'Payroll resumed successfully',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Resume payroll error:', error);
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
          message: 'Failed to resume payroll',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Get earnings report for employee
   * @route GET /api/employees/:id/earnings
   * @param id - MongoDB employee ID
   * @query startDate - Period start (ISO string)
   * @query endDate - Period end (ISO string)
   */
  getEarningsReport: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const report = await employeeService.getEarningsReport(id, startDate, endDate);

      res.status(200).json({
        success: true,
        data: report,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get earnings report error:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
          statusCode: 404,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch earnings report',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Get organization-wide payroll statistics
   * @route GET /api/employees/stats/payroll-total
   */
  getPayrollStats: async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await employeeService.getActivePayrollTotal();

      res.status(200).json({
        success: true,
        data: stats,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get payroll stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payroll statistics',
        statusCode: 500,
      });
    }
  },

  /**
   * Get employee statistics by department
   * @route GET /api/employees/stats/by-department
   */
  getEmployeeStats: async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await employeeService.getEmployeeCountByDepartment();

      res.status(200).json({
        success: true,
        data: stats,
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get employee stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch employee statistics',
        statusCode: 500,
      });
    }
  },
};
