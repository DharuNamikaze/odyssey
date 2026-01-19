// Custom error classes for better error handling

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', public details?: any) {
    super(400, message);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(429, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, message, false); // Not operational
  }
}

// Error handler for API routes
export function handleApiError(error: unknown): {
  statusCode: number;
  message: string;
  details?: any;
} {
  // Known application errors
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      details: error instanceof ValidationError ? error.details : undefined,
    };
  }

  // Unknown errors - don't leak details
  console.error('Unexpected error:', error);
  return {
    statusCode: 500,
    message: 'Internal server error',
  };
}
