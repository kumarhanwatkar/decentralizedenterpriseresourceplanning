import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/environment';
import { AuthenticationError, NotFoundError } from '../utils/errors';
import { walletUtils, generateNonce, isTimestampValid } from '../utils/wallet';
import { logger } from '../utils/logger';
import { UserRole, LoginResponse } from '../types';

/**
 * Authentication Service
 * Handles user authentication, token generation, and wallet verification
 */
export const authService = {
  /**
   * Generate a login message for the user to sign with MetaMask
   * @param walletAddress - User's wallet address
   * @returns Object with message and timestamp
   */
  generateLoginMessage: (walletAddress: string) => {
    if (!walletUtils.isValidAddress(walletAddress)) {
      throw new AuthenticationError('Invalid wallet address format');
    }

    const timestamp = Date.now();
    const nonce = generateNonce();

    const message = `
Decentralized ERP - Login Request

Wallet: ${walletAddress}
Nonce: ${nonce}
Timestamp: ${timestamp}

By signing this message, you confirm your identity and authorize the login.
This request will expire in 5 minutes.
    `.trim();

    return {
      message,
      timestamp,
      nonce,
    };
  },

  /**
   * Authenticate user with wallet signature
   * @param walletAddress - User's wallet address
   * @param message - The message the user signed
   * @param signature - The user's signature
   * @param timestamp - Timestamp when message was generated
   * @returns Login response with tokens and user info
   */
  authenticateWithWallet: async (
    walletAddress: string,
    message: string,
    signature: string,
    timestamp: number
  ): Promise<LoginResponse> => {
    // Validate inputs
    if (!walletAddress || !message || !signature) {
      throw new AuthenticationError('Missing required authentication parameters');
    }

    // Validate wallet address format
    if (!walletUtils.isValidAddress(walletAddress)) {
      throw new AuthenticationError('Invalid wallet address format');
    }

    // Verify timestamp is recent (prevent replay attacks)
    if (!isTimestampValid(timestamp)) {
      throw new AuthenticationError('Login request expired. Please try again.');
    }

    // Verify the signature matches the wallet
    walletUtils.verifyWalletOwnership(walletAddress, message, signature);

    // Find or create user
    const normalizedAddress = walletUtils.normalizeAddress(walletAddress);
    let user = await User.findOne({ walletAddress: normalizedAddress });

    if (!user) {
      // Create new user
      user = new User({
        walletAddress: normalizedAddress,
        name: `User ${walletUtils.formatAddress(normalizedAddress)}`,
        role: 'employee' as UserRole,
        status: 'active',
        joinDate: new Date(),
        loginCount: 1,
        lastLogin: new Date(),
      });

      await user.save();
      logger.info(`New user registered with wallet: ${normalizedAddress}`);
    } else {
      // Update existing user
      user.lastLogin = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      user.status = 'active'; // Reactivate if they were inactive
      await user.save();
      logger.info(`User logged in: ${normalizedAddress}`);
    }

    // Generate tokens
    const token = authService.generateAccessToken(
      user._id.toString(),
      normalizedAddress,
      user.role
    );

    const refreshToken = authService.generateRefreshToken(user._id.toString());

    const response: LoginResponse = {
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id.toString(),
        walletAddress: user.walletAddress,
        name: user.name,
        role: user.role,
      },
    };

    return response;
  },

  /**
   * Generate JWT access token
   * @param userId - User ID
   * @param walletAddress - User's wallet address
   * @param role - User's role
   * @param organizationId - Optional organization ID
   * @returns JWT token
   */
  generateAccessToken: (
    userId: string,
    walletAddress: string,
    role: UserRole,
    organizationId?: string
  ): string => {
    const payload = {
      id: userId,
      walletAddress,
      role,
      ...(organizationId && { organizationId }),
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expire,
      algorithm: 'HS256',
    });
  },

  /**
   * Generate JWT refresh token
   * @param userId - User ID
   * @returns Refresh token
   */
  generateRefreshToken: (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpire,
      algorithm: 'HS256',
    });
  },

  /**
   * Verify and refresh an expired access token
   * @param refreshToken - The refresh token
   * @returns New access token and refresh token
   */
  refreshAccessToken: async (
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string }> => {
    try {
      const decoded: any = jwt.verify(refreshToken, config.jwt.refreshSecret);

      // Get user to fetch current role and wallet
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new NotFoundError('User');
      }

      if (user.status !== 'active') {
        throw new AuthenticationError('User account is not active');
      }

      // Generate new tokens
      const newAccessToken = authService.generateAccessToken(
        user._id.toString(),
        user.walletAddress,
        user.role
      );

      const newRefreshToken = authService.generateRefreshToken(user._id.toString());

      return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Refresh token has expired. Please login again.');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid refresh token');
      }

      throw error;
    }
  },

  /**
   * Verify JWT token
   * @param token - The JWT token to verify
   * @returns Decoded token payload
   */
  verifyToken: (token: string): any => {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Token has expired');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid token');
      }

      throw error;
    }
  },

  /**
   * Get current user details
   * @param userId - User ID
   * @returns User document (excluding sensitive fields)
   */
  getCurrentUser: async (userId: string) => {
    const user = await User.findById(userId).select('-isDeleted');

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  },

  /**
   * Logout user (mainly for audit trail)
   * @param userId - User ID
   * @param reason - Optional logout reason
   */
  logout: async (userId: string, reason: string = 'Manual logout') => {
    try {
      // TODO: Could add logout tracking here if needed
      logger.info(`User ${userId} logged out. Reason: ${reason}`);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Verify user is active and not banned/deleted
   * @param userId - User ID
   * @returns true if user is active
   */
  isUserActive: async (userId: string): Promise<boolean> => {
    const user = await User.findById(userId);

    if (!user) {
      return false;
    }

    return user.status === 'active' && !user.isDeleted;
  },

  /**
   * Update user last login timestamp
   * @param userId - User ID
   */
  updateLastLogin: async (userId: string) => {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  },

  /**
   * Check if user has required role
   * @param userId - User ID
   * @param requiredRoles - Array of required roles
   * @returns true if user has one of the required roles
   */
  hasRole: async (userId: string, requiredRoles: UserRole[]): Promise<boolean> => {
    const user = await User.findById(userId);

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.role);
  },
};
