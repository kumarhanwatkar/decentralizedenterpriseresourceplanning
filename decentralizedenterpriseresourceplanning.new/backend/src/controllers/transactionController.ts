import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services/transactionService';
import { TransactionType, TransactionStatus } from '../types';
import { AppError } from '../utils/errors';

export class TransactionController {
  /**
   * GET /api/transactions - Get all transactions with filtering
   */
  static async getAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        type,
        status,
        fromAddress,
        toAddress,
        employeeId,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        token,
        sortBy = 'timestamp',
        sortOrder = 'desc',
      } = req.query;

      // Validate pagination
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

      // Build filters
      const filters: any = {};
      if (type) filters.type = type as TransactionType;
      if (status) filters.status = status as TransactionStatus;
      if (fromAddress) filters.fromAddress = (fromAddress as string).toLowerCase();
      if (toAddress) filters.toAddress = (toAddress as string).toLowerCase();
      if (employeeId) filters.employeeId = employeeId;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (minAmount) filters.minAmount = parseFloat(minAmount as string);
      if (maxAmount) filters.maxAmount = parseFloat(maxAmount as string);
      if (token) filters.token = token;

      const result = await transactionService.getAllTransactions(
        filters,
        pageNum,
        limitNum,
        (sortBy as 'timestamp' | 'amount') || 'timestamp',
        (sortOrder as 'asc' | 'desc') || 'desc'
      );

      res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
          limit: limitNum,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/transactions - Create a new transaction
   */
  static async createTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        txHash,
        blockNumber,
        type,
        fromAddress,
        toAddress,
        amount,
        token,
        fromEmployeeId,
        toEmployeeId,
        yieldGenerated,
        yieldPercentage,
        lockPeriod,
        status = 'pending',
        confirmations = 0,
        gasUsed = 0,
        description,
        metadata,
      } = req.body;

      // Validate required fields
      if (!txHash || !blockNumber || !type || !fromAddress || !toAddress || !amount || !token) {
        throw new AppError('Missing required fields', 400);
      }

      // Validate transaction type
      const validTypes: TransactionType[] = ['payroll', 'yield', 'transfer', 'fee'];
      if (!validTypes.includes(type)) {
        throw new AppError(`Invalid type. Must be one of: ${validTypes.join(', ')}`, 400);
      }

      // Validate transaction status
      const validStatuses: TransactionStatus[] = ['confirmed', 'pending', 'failed'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      // Validate token
      const validTokens = ['USDT', 'BUSD', 'USDC', 'BNB'];
      if (!validTokens.includes(token)) {
        throw new AppError(`Invalid token. Must be one of: ${validTokens.join(', ')}`, 400);
      }

      const transactionData = {
        txHash,
        blockNumber,
        type,
        fromAddress,
        toAddress,
        amount,
        token,
        fromEmployeeId,
        toEmployeeId,
        yieldGenerated,
        yieldPercentage,
        lockPeriod,
        status,
        confirmations,
        gasUsed,
        description,
        metadata,
      };

      const transaction = await transactionService.createTransaction(transactionData);

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transactions/:id - Get transaction by ID
   */
  static async getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const transaction = await transactionService.getTransactionById(id);

      res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transactions/hash/:txHash - Get transaction by blockchain hash
   */
  static async getTransactionByHash(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { txHash } = req.params;

      const transaction = await transactionService.getTransactionByHash(txHash);

      res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transactions/filter - Filter transactions by type and status
   */
  static async filterTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, status, page = 1, limit = 20 } = req.query;

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

      const result = await transactionService.filterTransactions(
        type as TransactionType | undefined,
        status as TransactionStatus | undefined,
        pageNum,
        limitNum
      );

      res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
          limit: limitNum,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/transactions/:id/status - Update transaction status
   */
  static async updateTransactionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, confirmations, gasUsed } = req.body;

      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const validStatuses: TransactionStatus[] = ['confirmed', 'pending', 'failed'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      const transaction = await transactionService.updateTransactionStatus(
        id,
        status,
        confirmations,
        gasUsed
      );

      res.status(200).json({
        success: true,
        message: 'Transaction status updated successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transactions/stats - Get transaction statistics
   */
  static async getTransactionStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, status, startDate, endDate } = req.query;

      const filters: any = {};
      if (type) filters.type = type as TransactionType;
      if (status) filters.status = status as TransactionStatus;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const stats = await transactionService.getTransactionStats(filters);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transactions/employee/:employeeId - Get transactions for an employee
   */
  static async getEmployeeTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employeeId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

      const result = await transactionService.getEmployeeTransactions(employeeId, pageNum, limitNum);

      res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
          limit: limitNum,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transactions/recent - Get recent transactions
   */
  static async getRecentTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));

      const transactions = await transactionService.getRecentTransactions(limitNum);

      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TransactionController;
