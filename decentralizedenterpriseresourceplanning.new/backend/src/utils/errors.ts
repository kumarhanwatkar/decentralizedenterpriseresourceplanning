import { CustomError } from '../types';

/**
 * General application error for any server error
 */
export class AppError extends CustomError {
  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'APP_ERROR'
  ) {
    super(statusCode, message, code);
    this.name = 'AppError';
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed') {
    super(401, message, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Access denied') {
    super(403, message, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}

export class ServerError extends CustomError {
  constructor(message: string = 'Internal server error') {
    super(500, message, 'SERVER_ERROR');
  }
}
