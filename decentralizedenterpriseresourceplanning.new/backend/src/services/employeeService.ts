/**
 * Employee Service Layer
 * Handles all employee-related business logic including:
 * - CRUD operations
 * - Real-time earnings calculation
 * - Payroll management (pause/resume)
 * - Employee search and filtering
 */

import Employee from '../models/Employee';
import { IEmployee, EmployeeStatus } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Real-time earnings calculation
 * Calculates the amount earned since last streaming update
 */
const calculateEarningsSinceLastStream = (
  hourlyRate: number,
  lastStreamedAt: Date,
  currentDate: Date = new Date()
): number => {
  // Calculate seconds elapsed since last stream
  const secondsElapsed = (currentDate.getTime() - lastStreamedAt.getTime()) / 1000;

  // Calculate accrual: hourlyRate / 3600 seconds * secondsElapsed
  const earningsAccrued = (hourlyRate / 3600) * secondsElapsed;

  return earningsAccrued;
};

/**
 * Update real-time earnings for an employee
 * This is called during streaming updates (every 1 second on frontend)
 * Updates totalAccrued and liquidAmount
 */
const updateRealTimeEarnings = async (
  employeeId: string,
  currentStreamTime: Date = new Date()
): Promise<{ earningsAccrued: number; totalAccrued: number; liquidAmount: number }> => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee');
    }

    // Don't accrue earnings if employee is paused, on leave, or terminated
    if (!['active'].includes(employee.status)) {
      return {
        earningsAccrued: 0,
        totalAccrued: employee.totalAccrued || 0,
        liquidAmount: employee.liquidAmount || 0,
      };
    }

    // Get last streamed time (default to startDate if first time)
    const lastStreamedAt = employee.lastStreamedAt || employee.startDate;

    // Calculate earnings since last stream
    const earningsAccrued = calculateEarningsSinceLastStream(
      employee.hourlyRate,
      lastStreamedAt,
      currentStreamTime
    );

    // Update totals
    const newTotalAccrued = (employee.totalAccrued || 0) + earningsAccrued;
    const newLiquidAmount = (employee.liquidAmount || 0) + earningsAccrued;

    // Update employee with new earnings
    employee.totalAccrued = newTotalAccrued;
    employee.liquidAmount = newLiquidAmount;
    employee.lastStreamedAt = currentStreamTime;

    await employee.save();

    logger.debug(`Updated earnings for employee ${employeeId}:`, {
      earningsAccrued: earningsAccrued.toFixed(2),
      totalAccrued: newTotalAccrued.toFixed(2),
      liquidAmount: newLiquidAmount.toFixed(2),
    });

    return {
      earningsAccrued,
      totalAccrued: newTotalAccrued,
      liquidAmount: newLiquidAmount,
    };
  } catch (error) {
    logger.error('Error updating real-time earnings:', error);
    throw error;
  }
};

/**
 * Employee Service Methods
 */
const employeeService = {
  /**
   * Get all employees with pagination
   */
  getAllEmployees: async (
    page: number = 1,
    pageSize: number = 20,
    filters?: { department?: string; status?: EmployeeStatus }
  ): Promise<{ employees: IEmployee[]; total: number; page: number; totalPages: number }> => {
    try {
      const skip = (page - 1) * pageSize;
      const query: any = {};

      if (filters?.department) {
        query.department = filters.department;
      }
      if (filters?.status) {
        query.status = filters.status;
      }

      const [employees, total] = await Promise.all([
        Employee.find(query)
          .skip(skip)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean<IEmployee[]>(),
        Employee.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        employees,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      logger.error('Error getting all employees:', error);
      throw error;
    }
  },

  /**
   * Get employee by ID with updated earnings
   */
  getEmployeeById: async (employeeId: string): Promise<IEmployee> => {
    try {
      const employee = await Employee.findById(employeeId)
        .populate('userId', 'walletAddress email')
        .lean<IEmployee>();

      if (!employee) {
        throw new NotFoundError('Employee');
      }

      // Update real-time earnings before returning
      if (employee.status === 'active') {
        const earnings = await updateRealTimeEarnings(employeeId as string);
        employee.totalAccrued = earnings.totalAccrued;
        employee.liquidAmount = earnings.liquidAmount;
      }

      return employee;
    } catch (error) {
      logger.error('Error getting employee by ID:', error);
      throw error;
    }
  },

  /**
   * Get employee by employee ID (not MongoDB _id)
   */
  getEmployeeByEmployeeId: async (employeeId: string): Promise<IEmployee> => {
    try {
      const employee = await Employee.findOne({ employeeId })
        .populate('userId', 'walletAddress email')
        .lean<IEmployee>();

      if (!employee) {
        throw new NotFoundError('Employee');
      }

      return employee;
    } catch (error) {
      logger.error('Error getting employee by employee ID:', error);
      throw error;
    }
  },

  /**
   * Create new employee
   */
  createEmployee: async (employeeData: Partial<IEmployee>): Promise<IEmployee> => {
    try {
      // Validate required fields
      const requiredFields = [
        'employeeId',
        'firstName',
        'lastName',
        'email',
        'department',
        'role',
        'hourlyRate',
        'baseSalary',
        'walletAddress',
        'coldWallet',
        'hotWallet',
        'userId',
      ];

      for (const field of requiredFields) {
        if (!employeeData[field as keyof IEmployee]) {
          throw new ValidationError(`${field} is required`);
        }
      }

      // Check for duplicate employee ID
      const existingEmployee = await Employee.findOne({ employeeId: employeeData.employeeId });
      if (existingEmployee) {
        throw new ValidationError('Employee ID already exists');
      }

      // Check for duplicate email
      const existingEmail = await Employee.findOne({ email: employeeData.email });
      if (existingEmail) {
        throw new ValidationError('Email already exists');
      }

      // Create employee with initial values
      const employee = new Employee({
        ...employeeData,
        startDate: new Date(),
        totalEarned: 0,
        totalAccrued: 0,
        liquidAmount: 0,
        totalPaid: 0,
        pendingAmount: 0,
        lastStreamedAt: new Date(),
        status: employeeData.status || 'active',
      });

      await employee.save();

      logger.info(`Employee created: ${employeeData.employeeId}`);
      return employee.toObject();
    } catch (error) {
      logger.error('Error creating employee:', error);
      throw error;
    }
  },

  /**
   * Update employee
   */
  updateEmployee: async (
    employeeId: string,
    updates: Partial<IEmployee>
  ): Promise<IEmployee> => {
    try {
      // Don't allow updating these fields
      delete updates.employeeId;
      delete updates.userId;
      delete updates.createdAt;

      const employee = await Employee.findByIdAndUpdate(employeeId, updates, {
        new: true,
        runValidators: true,
      })
        .populate('userId', 'walletAddress email')
        .lean<IEmployee>();

      if (!employee) {
        throw new NotFoundError('Employee');
      }

      logger.info(`Employee updated: ${employeeId}`);
      return employee;
    } catch (error) {
      logger.error('Error updating employee:', error);
      throw error;
    }
  },

  /**
   * Update employee status with payroll handling
   */
  updateEmployeeStatus: async (
    employeeId: string,
    newStatus: EmployeeStatus
  ): Promise<IEmployee & { statusChangeNote?: string }> => {
    try {
      const validStatuses = ['active', 'on_leave', 'paused', 'terminated'];
      if (!validStatuses.includes(newStatus)) {
        throw new ValidationError(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        );
      }

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new NotFoundError('Employee');
      }

      const previousStatus = employee.status;

      // Handle payroll pause/resume logic
      let statusChangeNote = '';

      if (previousStatus === 'active' && newStatus === 'paused') {
        // Pause payroll - final earnings accrual before pause
        const earnings = await updateRealTimeEarnings(employeeId as string);
        statusChangeNote = `Payroll paused. Final earnings accrued: $${earnings.earningsAccrued.toFixed(2)}`;
        logger.info(`Payroll paused for employee ${employeeId}`);
      } else if (previousStatus === 'paused' && newStatus === 'active') {
        // Resume payroll - reset streaming timestamp
        employee.lastStreamedAt = new Date();
        statusChangeNote = 'Payroll resumed. Streaming timestamp reset.';
        logger.info(`Payroll resumed for employee ${employeeId}`);
      } else if (newStatus === 'on_leave') {
        // On leave - accrue earnings but mark as on leave
        await updateRealTimeEarnings(employeeId);
        statusChangeNote = `Employee on leave. Earnings paused.`;
      } else if (newStatus === 'terminated') {
        // Terminated - final earnings accrual and calculation
        const earnings = await updateRealTimeEarnings(employeeId);
        employee.endDate = new Date();
        statusChangeNote = `Employee terminated. Final accrued earnings: $${earnings.earningsAccrued.toFixed(2)}`;
        logger.info(`Employee terminated: ${employeeId}. Final earnings: ${earnings.earningsAccrued}`);
      }

      employee.status = newStatus;
      await employee.save();

      const result = employee.toObject() as IEmployee & { statusChangeNote?: string };
      result.statusChangeNote = statusChangeNote;

      return result;
    } catch (error) {
      logger.error('Error updating employee status:', error);
      throw error;
    }
  },

  /**
   * Delete employee
   */
  deleteEmployee: async (employeeId: string): Promise<void> => {
    try {
      const employee = await Employee.findByIdAndDelete(employeeId);
      if (!employee) {
        throw new NotFoundError('Employee');
      }

      logger.info(`Employee deleted: ${employeeId}`);
    } catch (error) {
      logger.error('Error deleting employee:', error);
      throw error;
    }
  },

  /**
   * Search employees by various criteria
   */
  searchEmployees: async (
    query?: string,
    filters?: { department?: string; status?: EmployeeStatus; role?: string }
  ): Promise<IEmployee[]> => {
    try {
      const searchFilter: any = {};

      if (query) {
        searchFilter.$or = [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { employeeId: { $regex: query, $options: 'i' } },
          { department: { $regex: query, $options: 'i' } },
        ];
      }

      if (filters?.department) {
        searchFilter.department = filters.department;
      }
      if (filters?.status) {
        searchFilter.status = filters.status;
      }
      if (filters?.role) {
        searchFilter.role = filters.role;
      }

      const employees = await Employee.find(searchFilter)
        .limit(50)
        .sort({ createdAt: -1 })
        .lean<IEmployee[]>();

      return employees;
    } catch (error) {
      logger.error('Error searching employees:', error);
      throw error;
    }
  },

  /**
   * Pause payroll for an employee
   */
  pausePayroll: async (employeeId: string): Promise<IEmployee> => {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new NotFoundError('Employee');
      }

      if (employee.status !== 'active') {
        throw new ValidationError('Can only pause payroll for active employees');
      }

      // Final earnings accrual before pause
      await updateRealTimeEarnings(employeeId);

      // Update status to paused
      employee.status = 'paused';
      await employee.save();

      logger.info(`Payroll paused for employee ${employeeId}`);
      return employee.toObject();
    } catch (error) {
      logger.error('Error pausing payroll:', error);
      throw error;
    }
  },

  /**
   * Resume payroll for an employee
   */
  resumePayroll: async (employeeId: string): Promise<IEmployee> => {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new NotFoundError('Employee');
      }

      if (employee.status !== 'paused') {
        throw new ValidationError('Can only resume payroll for paused employees');
      }

      // Reset streaming timestamp to now
      employee.lastStreamedAt = new Date();
      employee.status = 'active';
      await employee.save();

      logger.info(`Payroll resumed for employee ${employeeId}`);
      return employee.toObject();
    } catch (error) {
      logger.error('Error resuming payroll:', error);
      throw error;
    }
  },

  /**
   * Get payroll summary for an employee
   */
  getPayrollSummary: async (
    employeeId: string
  ): Promise<{
    employeeId: string;
    firstName: string;
    lastName: string;
    hourlyRate: number;
    totalAccrued: number;
    liquidAmount: number;
    totalPaid: number;
    pendingAmount: number;
    status: EmployeeStatus;
  }> => {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new NotFoundError('Employee');
      }

      // Update earnings before returning summary
      if (employee.status === 'active') {
        await updateRealTimeEarnings(employeeId);
      }

      return {
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        hourlyRate: employee.hourlyRate,
        totalAccrued: employee.totalAccrued || 0,
        liquidAmount: employee.liquidAmount || 0,
        totalPaid: employee.totalPaid || 0,
        pendingAmount: employee.pendingAmount || 0,
        status: employee.status,
      };
    } catch (error) {
      logger.error('Error getting payroll summary:', error);
      throw error;
    }
  },

  /**
   * Get earnings for a time period
   */
  getEarningsReport: async (
    employeeId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    employeeId: string;
    periodStart: Date;
    periodEnd: Date;
    totalEarned: number;
    hourlyRate: number;
    hoursWorked: number;
  }> => {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new NotFoundError('Employee');
      }

      const period = {
        start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default: last 30 days
        end: endDate || new Date(),
      };

      // This would need transaction data to be accurate
      // For now, just return earnings summary
      const hoursWorked = (period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60);
      const totalEarned = employee.hourlyRate * hoursWorked;

      return {
        employeeId: employee.employeeId,
        periodStart: period.start,
        periodEnd: period.end,
        totalEarned,
        hourlyRate: employee.hourlyRate,
        hoursWorked,
      };
    } catch (error) {
      logger.error('Error getting earnings report:', error);
      throw error;
    }
  },

  /**
   * Utility: Calculate earnings between two dates for estimation
   */
  calculateEstimatedEarnings: (
    hourlyRate: number,
    startDate: Date,
    endDate: Date = new Date()
  ): number => {
    const milliseconds = endDate.getTime() - startDate.getTime();
    const seconds = milliseconds / 1000;
    return (hourlyRate / 3600) * seconds;
  },

  /**
   * Get employee count by department
   */
  getEmployeeCountByDepartment: async (): Promise<
    Array<{ department: string; count: number }>
  > => {
    try {
      const counts = await Employee.aggregate([
        { $match: { status: { $ne: 'terminated' } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      return counts.map((item: any) => ({
        department: item._id,
        count: item.count,
      }));
    } catch (error) {
      logger.error('Error getting employee count by department:', error);
      throw error;
    }
  },

  /**
   * Get active payroll total for organization
   */
  getActivePayrollTotal: async (): Promise<{
    totalActiveEmployees: number;
    totalAccrued: number;
    totalLiquidAmount: number;
    totalPendingPayments: number;
    averageHourlyRate: number;
  }> => {
    try {
      const stats = await Employee.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            totalEmployees: { $sum: 1 },
            totalAccrued: { $sum: '$totalAccrued' },
            totalLiquid: { $sum: '$liquidAmount' },
            totalPending: { $sum: '$pendingAmount' },
            avgHourlyRate: { $avg: '$hourlyRate' },
          },
        },
      ]);

      if (stats.length === 0) {
        return {
          totalActiveEmployees: 0,
          totalAccrued: 0,
          totalLiquidAmount: 0,
          totalPendingPayments: 0,
          averageHourlyRate: 0,
        };
      }

      return {
        totalActiveEmployees: stats[0].totalEmployees,
        totalAccrued: stats[0].totalAccrued || 0,
        totalLiquidAmount: stats[0].totalLiquid || 0,
        totalPendingPayments: stats[0].totalPending || 0,
        averageHourlyRate: stats[0].avgHourlyRate || 0,
      };
    } catch (error) {
      logger.error('Error getting active payroll total:', error);
      throw error;
    }
  },
};

export default employeeService;
export { updateRealTimeEarnings, calculateEarningsSinceLastStream };
