import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { AuthenticatedRequest, UserRole } from '../types';

// Extend Express Request with auth data
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedRequest;
    }
  }
}

// JWT verification middleware
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    jwt.verify(token, config.jwt.secret, (err: any, user: any) => {
      if (err) {
        throw new AuthenticationError('Invalid token');
      }

      req.user = {
        userId: user.id,
        userRole: user.role,
        walletAddress: user.walletAddress,
        organizationId: user.organizationId,
      };

      next();
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      res.status(401).json({
        success: false,
        message: error.message,
        statusCode: 401,
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        statusCode: 401,
      });
    }
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('No user found');
      }

      if (!allowedRoles.includes(req.user.userRole)) {
        throw new AuthorizationError(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      if (error instanceof AuthorizationError) {
        res.status(403).json({
          success: false,
          message: error.message,
          statusCode: 403,
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
      }
    }
  };
};

// Verify user is admin
export const isAdmin = authorize('admin');

// Verify user is employee or admin
export const isAdminOrEmployee = authorize('admin', 'employee', 'manager');
