import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController';
import { authenticateToken, isAdmin } from '../middleware/authentication';

const router = Router();

/**
 * Settings Routes
 * Base path: /api/settings
 */

// Middleware
router.use(authenticateToken);

/**
 * @route   GET /api/settings
 * @desc    Get settings for organization
 * @access  Private
 * @note    Returns organization settings or creates with defaults
 */
router.get('/', SettingsController.getSettings);

/**
 * @route   GET /api/settings/defaults
 * @desc    Get settings with defaults applied (globally accessible)
 * @access  Private
 * @note    Always returns settings object with defaults
 */
router.get('/defaults', SettingsController.getSettingsWithDefaults);

/**
 * @route   PATCH /api/settings
 * @desc    Update all settings at once
 * @access  Admin
 * @body    Any combination of:
 *          - companyName, companyEmail, companyPhone, companyLogo
 *          - payrollCycle, payrollDay
 *          - yieldDistributionPercent
 *          - notificationSettings: { emailPayroll?, emailYield?, emailSystem?, smsPayroll? }
 *          - blockchainNetwork, smartContractAddress
 *          - twoFactorEnabled
 */
router.patch('/', isAdmin, SettingsController.updateAllSettings);

/**
 * @route   PATCH /api/settings/company
 * @desc    Update company information
 * @access  Admin
 * @body    { companyName?, companyEmail?, companyPhone?, companyLogo? }
 */
router.patch('/company', isAdmin, SettingsController.updateCompanyInfo);

/**
 * @route   PATCH /api/settings/payroll-cycle
 * @desc    Update payroll cycle and day
 * @access  Admin
 * @body    { payrollCycle: 'weekly'|'biweekly'|'monthly', payrollDay?: number }
 */
router.patch('/payroll-cycle', isAdmin, SettingsController.updatePayrollCycle);

/**
 * @route   PATCH /api/settings/yield-percentage
 * @desc    Update yield distribution percentage
 * @access  Admin
 * @body    { yieldDistributionPercent: number (0-100) }
 * @note    Liquid percentage is automatically calculated (100 - yield)
 */
router.patch('/yield-percentage', isAdmin, SettingsController.updateYieldPercentage);

/**
 * @route   PATCH /api/settings/notifications
 * @desc    Update notification settings
 * @access  Admin
 * @body    { emailPayroll?, emailYield?, emailSystem?, smsPayroll? }
 */
router.patch('/notifications', isAdmin, SettingsController.updateNotificationSettings);

/**
 * @route   PATCH /api/settings/blockchain
 * @desc    Update blockchain network configuration
 * @access  Admin
 * @body    { blockchainNetwork: 'bsc_mainnet'|'bsc_testnet', smartContractAddress? }
 */
router.patch('/blockchain', isAdmin, SettingsController.updateBlockchainNetwork);

/**
 * @route   PATCH /api/settings/2fa
 * @desc    Toggle two-factor authentication
 * @access  Admin
 * @body    { enabled: boolean }
 */
router.patch('/2fa', isAdmin, SettingsController.toggleTwoFactorAuth);



export default router;
