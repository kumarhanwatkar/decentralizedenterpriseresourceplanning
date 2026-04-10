import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authentication';
import { validateRequest, validators } from '../utils/validators';

const router = Router();

/**
 * Public Routes (No authentication required)
 */

/**
 * @route GET /api/auth/login-message
 * @desc Generate a login message for user to sign with MetaMask
 * @body { walletAddress: string }
 * @returns { message, timestamp, nonce }
 */
router.post(
  '/login-message',
  validateRequest(validators.walletAddress),
  authController.getLoginMessage
);

/**
 * @route POST /api/auth/wallet-login
 * @desc Login with wallet signature
 * @body { walletAddress, signature, message, timestamp }
 * @returns { token, refreshToken, user }
 */
router.post(
  '/wallet-login',
  validateRequest(
    validators.walletAddress,
    validators.requiredString('signature'),
    validators.requiredString('message'),
    validators.requiredString('timestamp')
  ),
  authController.walletLogin
);

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh expired access token
 * @body { refreshToken: string }
 * @returns { token, refreshToken }
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * Protected Routes (Authentication required)
 */

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user
 * @headers Authorization: Bearer {token}
 * @returns { user object }
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @headers Authorization: Bearer {token}
 * @returns { success message }
 */
router.post('/logout', authenticateToken, authController.logout);

export default router;
