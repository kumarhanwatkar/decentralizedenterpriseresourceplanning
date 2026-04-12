import Transaction from '../models/Transaction';
// import Employee from '../models/Employee'; // Removed unused import
import { ITransaction, TransactionType, TransactionStatus } from '../types';
import { AppError } from '../utils/errors';

interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  fromAddress?: string;
  toAddress?: string;
  employeeId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  token?: string;
}

interface TransactionQuery {
  type?: TransactionType;
  status?: TransactionStatus;
  $or?: Array<{ fromAddress: string } | { toAddress: string }>;
  fromAddress?: string;
  toAddress?: string;
  timestamp?: { $gte?: Date; $lte?: Date };
  amount?: { $gte?: number; $lte?: number };
  token?: string;
}

export class TransactionService {
  /**
   * Create a new transaction
   */
  async createTransaction(transactionData: {
    txHash: string;
    blockNumber: number;
    type: TransactionType;
    fromAddress: string;
    toAddress: string;
    amount: number;
    token: 'USDT' | 'BUSD' | 'USDC' | 'BNB';
    fromEmployeeId?: string;
    toEmployeeId?: string;
    yieldGenerated?: number;
    yieldPercentage?: number;
    lockPeriod?: number;
    status?: TransactionStatus;
    confirmations?: number;
    gasUsed?: number;
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<ITransaction> {
    try {
      // Validate blockchain hash format (0x + 64 hex chars)
      if (!/^0x[a-fA-F0-9]{64}$/.test(transactionData.txHash)) {
        throw new AppError('Invalid blockchain transaction hash format', 400);
      }

      // Validate wallet addresses format (0x + 40 hex chars)
      if (!/^0x[a-fA-F0-9]{40}$/.test(transactionData.fromAddress)) {
        throw new AppError('Invalid fromAddress format', 400);
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(transactionData.toAddress)) {
        throw new AppError('Invalid toAddress format', 400);
      }

      // Check if transaction already exists
      const existingTx = await Transaction.findOne({ txHash: transactionData.txHash });
      if (existingTx) {
        throw new AppError('Transaction with this hash already exists', 409);
      }

      // Validate amount
      if (transactionData.amount <= 0) {
        throw new AppError('Amount must be greater than 0', 400);
      }

      // Validate yield percentage if provided
      if (transactionData.yieldPercentage !== undefined) {
        if (transactionData.yieldPercentage < 0 || transactionData.yieldPercentage > 100) {
          throw new AppError('Yield percentage must be between 0 and 100', 400);
        }
      }

      // Create transaction
      const transaction = new Transaction({
        ...transactionData,
        status: transactionData.status || 'pending',
      });

      await transaction.save();

      // Populate employee references if they exist
      await transaction.populate('fromEmployeeId');
      await transaction.populate('toEmployeeId');

      return transaction.toObject() as ITransaction;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create transaction', 500);
    }
  }

  /**
   * Get all transactions with filtering and pagination
   */
  async getAllTransactions(
    filters?: TransactionFilters,
    page: number = 1,
    limit: number = 20,
    sortBy: 'timestamp' | 'amount' = 'timestamp',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ transactions: ITransaction[]; total: number; page: number; pages: number }> {
    try {
      // Build query
      const query: TransactionQuery = {};

      if (filters?.type) query.type = filters.type;
      if (filters?.status) query.status = filters.status;
      if (filters?.token) query.token = filters.token;

      if (filters?.fromAddress || filters?.employeeId) {
        if (!query.$or) query.$or = [];
        if (filters.fromAddress) {
          (query.$or as any[]).push({ fromAddress: filters.fromAddress.toLowerCase() });
        }
        if (filters.employeeId) {
          (query.$or as any[]).push({ fromEmployeeId: filters.employeeId });
        }
      }

      if (filters?.toAddress) {
        query.toAddress = filters.toAddress.toLowerCase();
      }

      if (filters?.startDate || filters?.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = filters.startDate;
        if (filters.endDate) query.timestamp.$lte = filters.endDate;
      }

      if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
        query.amount = {};
        if (filters.minAmount !== undefined) query.amount.$gte = filters.minAmount;
        if (filters.maxAmount !== undefined) query.amount.$lte = filters.maxAmount;
      }

      // Execute query
      const skip = (page - 1) * limit;
      const sortObj: Record<string, 1 | -1> = {};
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [transactions, total] = await Promise.all([
        Transaction.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .populate('fromEmployeeId', 'employeeId email firstName lastName')
          .populate('toEmployeeId', 'employeeId email firstName lastName')
          .lean(),
        Transaction.countDocuments(query),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        transactions: transactions as ITransaction[],
        total,
        page,
        pages,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch transactions', 500);
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<ITransaction> {
    try {
      const transaction = await Transaction.findById(transactionId)
        .populate('fromEmployeeId', 'employeeId email firstName lastName')
        .populate('toEmployeeId', 'employeeId email firstName lastName');

      if (!transaction) {
        throw new AppError('Transaction not found', 404);
      }

      return transaction.toObject() as ITransaction;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch transaction', 500);
    }
  }

  /**
   * Get transaction by blockchain hash
   */
  async getTransactionByHash(txHash: string): Promise<ITransaction> {
    try {
      const transaction = await Transaction.findOne({ txHash: txHash.toLowerCase() })
        .populate('fromEmployeeId', 'employeeId email firstName lastName')
        .populate('toEmployeeId', 'employeeId email firstName lastName');

      if (!transaction) {
        throw new AppError('Transaction with this hash not found', 404);
      }

      return transaction.toObject() as ITransaction;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch transaction', 500);
    }
  }

  /**
   * Filter transactions by type and status
   */
  async filterTransactions(
    type?: TransactionType,
    status?: TransactionStatus,
    page: number = 1,
    limit: number = 20
  ): Promise<{ transactions: ITransaction[]; total: number; page: number; pages: number }> {
    try {
      const query: Record<string, any> = {};

      if (type) query.type = type;
      if (status) query.status = status;

      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        Transaction.find(query)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .populate('fromEmployeeId', 'employeeId email firstName lastName')
          .populate('toEmployeeId', 'employeeId email firstName lastName')
          .lean(),
        Transaction.countDocuments(query),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        transactions: transactions as ITransaction[],
        total,
        page,
        pages,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to filter transactions', 500);
    }
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
    confirmations?: number,
    gasUsed?: number
  ): Promise<ITransaction> {
    try {
      const transaction = await Transaction.findByIdAndUpdate(
        transactionId,
        {
          $set: {
            status,
            ...(confirmations !== undefined && { confirmations }),
            ...(gasUsed !== undefined && { gasUsed }),
          },
        },
        { new: true }
      )
        .populate('fromEmployeeId', 'employeeId email firstName lastName')
        .populate('toEmployeeId', 'employeeId email firstName lastName');

      if (!transaction) {
        throw new AppError('Transaction not found', 404);
      }

      return transaction.toObject() as ITransaction;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update transaction', 500);
    }
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(filters?: {
    type?: TransactionType;
    status?: TransactionStatus;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    totalCount: number;
    totalAmount: number;
    byType: Record<TransactionType, number>;
    byStatus: Record<TransactionStatus, number>;
    byToken: Record<string, number>;
    averageAmount: number;
  }> {
    try {
      const query: Record<string, any> = {};

      if (filters?.type) query.type = filters.type;
      if (filters?.status) query.status = filters.status;
      if (filters?.startDate || filters?.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = filters.startDate;
        if (filters.endDate) query.timestamp.$lte = filters.endDate;
      }

      const [total, stats, byType, byStatus, byToken] = await Promise.all([
        Transaction.countDocuments(query),
        Transaction.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$amount' },
              averageAmount: { $avg: '$amount' },
            },
          },
        ]),
        Transaction.aggregate([
          { $match: query },
          { $group: { _id: '$type', count: { $sum: 1 } } },
        ]),
        Transaction.aggregate([
          { $match: query },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Transaction.aggregate([
          { $match: query },
          { $group: { _id: '$token', total: { $sum: '$amount' } } },
        ]),
      ]);

      const byTypeObj = byType.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        },
        {} as Record<TransactionType, number>
      );

      const byStatusObj = byStatus.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        },
        {} as Record<TransactionStatus, number>
      );

      const byTokenObj = byToken.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item.total;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        totalCount: total,
        totalAmount: stats[0]?.totalAmount || 0,
        byType: byTypeObj,
        byStatus: byStatusObj,
        byToken: byTokenObj,
        averageAmount: stats[0]?.averageAmount || 0,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get transaction statistics', 500);
    }
  }

  /**
   * Get transactions for a specific employee
   */
  async getEmployeeTransactions(
    employeeId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ transactions: ITransaction[]; total: number; page: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        Transaction.find({
          $or: [{ fromEmployeeId: employeeId }, { toEmployeeId: employeeId }],
        })
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .populate('fromEmployeeId', 'employeeId email firstName lastName')
          .populate('toEmployeeId', 'employeeId email firstName lastName')
          .lean(),
        Transaction.countDocuments({
          $or: [{ fromEmployeeId: employeeId }, { toEmployeeId: employeeId }],
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        transactions: transactions as ITransaction[],
        total,
        page,
        pages,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch employee transactions', 500);
    }
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limit: number = 10): Promise<ITransaction[]> {
    try {
      const transactions = await Transaction.find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('fromEmployeeId', 'employeeId email firstName lastName')
        .populate('toEmployeeId', 'employeeId email firstName lastName')
        .lean();

      return transactions as ITransaction[];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch recent transactions', 500);
    }
  }
}

export const transactionService = new TransactionService();
