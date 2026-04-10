import { Router, Request, Response, NextFunction } from 'express';
import TransactionController from '../controllers/transactionController';
import { authenticateToken, authorize } from '../middleware/authentication';

const router = Router();

// Middleware to protect all routes
router.use(authenticateToken);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with filtering and pagination
 * @access  Private
 * @query   page, limit, type, status, fromAddress, toAddress, employeeId, startDate, endDate, minAmount, maxAmount, token, sortBy, sortOrder
 */
router.get('/', TransactionController.getAllTransactions);

/**
 * @route   GET /api/transactions/recent
 * @desc    Get recent transactions (last N transactions)
 * @access  Private
 * @query   limit
 */
router.get('/recent', TransactionController.getRecentTransactions);

/**
 * @route   GET /api/transactions/stats
 * @desc    Get transaction statistics
 * @access  Private
 * @query   type, status, startDate, endDate
 */
router.get('/stats', TransactionController.getTransactionStats);

/**
 * @route   GET /api/transactions/filter
 * @desc    Filter transactions by type and status
 * @access  Private
 * @query   type, status, page, limit
 */
router.get('/filter', TransactionController.filterTransactions);

/**
 * @route   GET /api/transactions/employee/:employeeId
 * @desc    Get transactions for a specific employee
 * @access  Private
 * @params  employeeId
 * @query   page, limit
 */
router.get('/employee/:employeeId', TransactionController.getEmployeeTransactions);

/**
 * @route   GET /api/transactions/hash/:txHash
 * @desc    Get transaction by blockchain hash
 * @access  Private
 * @params  txHash
 */
router.get('/hash/:txHash', (req: Request, res: Response, next: NextFunction) => {
  // Explicit route to handle hash lookups before :id
  TransactionController.getTransactionByHash(req, res, next);
});

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private/Admin
 * @body    txHash, blockNumber, type, fromAddress, toAddress, amount, token, [fromEmployeeId, toEmployeeId, yieldGenerated, yieldPercentage, lockPeriod, status, confirmations, gasUsed, description, metadata]
 */
router.post('/', authorize(['admin']), TransactionController.createTransaction);

/**
 * @route   PATCH /api/transactions/:id/status
 * @desc    Update transaction status
 * @access  Private/Admin
 * @params  id
 * @body    status, [confirmations, gasUsed]
 */
router.patch('/:id/status', authorize(['admin']), TransactionController.updateTransactionStatus);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private
 * @params  id
 */
router.get('/:id', TransactionController.getTransactionById);

export default router;
