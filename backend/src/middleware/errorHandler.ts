import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse, CustomError } from '../types';

// Global error handling middleware
export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
    } as ApiResponse);
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      statusCode: 500,
    } as ApiResponse);
  }
};

// 404 handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    statusCode: 404,
  });
};
