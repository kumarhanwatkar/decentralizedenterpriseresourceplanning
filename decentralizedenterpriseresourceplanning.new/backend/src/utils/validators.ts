import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errors';
const { body, validationResult } = require('express-validator');

// Custom validators
export const validators = {
  // Wallet address validation
  walletAddress: body('walletAddress')
    .isString()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid wallet address format'),

  // Email validation
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),

  // Hourly rate validation
  hourlyRate: body('hourlyRate')
    .isFloat({ min: 0 })
    .withMessage('Hourly rate must be a positive number'),

  // Amount validation
  amount: body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),

  // Required string
  requiredString: (field: string) => (
    body(field)
      .isString()
      .trim()
      .notEmpty()
      .withMessage(`${field} is required`)
  ),

  // Optional string
  optionalString: (field: string) => (
    body(field)
      .optional()
      .isString()
      .trim()
  ),
};

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  // res: Response, // Removed unused parameter
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err: any) => ({
      field: err.param,
      message: err.msg,
    }));

    throw new ValidationError(
      `Validation failed: ${errorMessages.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`
    );
  }

  next();
};

// Chain validators
export const validateRequest = (...validations: any[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    handleValidationErrors(req, next);
  };
};
