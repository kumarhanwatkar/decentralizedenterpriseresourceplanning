import { Request, Response } from 'express';
import { AuthenticationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { LoginRequest } from '../types';
import { authService } from '../services/authService';

export const authController = {
  /**
   * Generate login message for user to sign
   * User should sign this message with their MetaMask wallet
   */
  getLoginMessage: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        throw new AuthenticationError('Wallet address is required');
      }

      const messageData = authService.generateLoginMessage(walletAddress);

      res.status(200).json({
        success: true,
        data: messageData,
        message: 'Sign this message with your wallet to login',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get login message error:', error);
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          message: error.message,
          statusCode: 401,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to generate login message',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Wallet-based login
   * User sends signed message along with their wallet address
   */
  walletLogin: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress, signature, message, timestamp } = req.body as LoginRequest & {
        signature?: string;
        message: string;
        timestamp: number;
      };

      if (!walletAddress || !signature || !message || !timestamp) {
        throw new AuthenticationError('Wallet address, signature, message, and timestamp are required');
      }

      // Authenticate with wallet
      const loginResponse = await authService.authenticateWithWallet(
        walletAddress,
        message,
        signature,
        timestamp
      );

      res.status(200).json(loginResponse);
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          message: error.message,
          statusCode: 401,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Login failed',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Refresh access token
   * Client sends refresh token to get new access token
   */
  refreshToken: async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AuthenticationError('Refresh token is required');
      }

      const tokens = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        data: tokens,
        message: 'Token refreshed successfully',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      if (error instanceof AuthenticationError) {
        res.status(401).json({
          success: false,
          message: error.message,
          statusCode: 401,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Token refresh failed',
          statusCode: 500,
        });
      }
    }
  },

  /**
   * Get current user details
   * Requires authentication
   */
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthenticationError('No authenticated user');
      }

      const user = await authService.getCurrentUser(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
        message: 'User retrieved successfully',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user',
        statusCode: 500,
      });
    }
  },

  /**
   * Logout user
   * Token is still valid until expiration; client should delete it from storage
   */
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthenticationError('No authenticated user');
      }

      await authService.logout(req.user.userId, 'User logout');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        statusCode: 500,
      });
    }
  },
};
