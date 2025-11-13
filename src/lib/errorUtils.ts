/**
 * Error handling utilities for the Hospital Management System
 */

import { ErrorType } from '@/types/enums';

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

/**
 * Transform various error types into a standardized AppError format
 */
export function transformError(error: unknown): AppError {
  const timestamp = new Date();

  // Handle AppError instances
  if (isAppError(error)) {
    return error;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network connection failed. Please check your internet connection.',
        details: error.message,
        timestamp,
      };
    }

    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return {
        type: ErrorType.AUTHENTICATION_ERROR,
        message: 'Authentication failed. Please log in again.',
        details: error.message,
        timestamp,
      };
    }

    if (error.message.includes('permission') || error.message.includes('forbidden')) {
      return {
        type: ErrorType.AUTHORIZATION_ERROR,
        message: 'You do not have permission to perform this action.',
        details: error.message,
        timestamp,
      };
    }

    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        type: ErrorType.NOT_FOUND_ERROR,
        message: 'The requested resource was not found.',
        details: error.message,
        timestamp,
      };
    }

    if (error.message.includes('conflict') || error.message.includes('duplicate')) {
      return {
        type: ErrorType.CONFLICT_ERROR,
        message: 'A conflict occurred. The resource may already exist.',
        details: error.message,
        timestamp,
      };
    }

    // Default to database error for other errors
    return {
      type: ErrorType.DATABASE_ERROR,
      message: error.message || 'An unexpected error occurred.',
      details: error,
      timestamp,
    };
  }

  // Handle Supabase errors
  if (isSupabaseError(error)) {
    return transformSupabaseError(error);
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      type: ErrorType.DATABASE_ERROR,
      message: error,
      timestamp,
    };
  }

  // Handle unknown errors
  return {
    type: ErrorType.DATABASE_ERROR,
    message: 'An unexpected error occurred.',
    details: error,
    timestamp,
  };
}

/**
 * Check if an error is an AppError
 */
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'timestamp' in error
  );
}

/**
 * Check if an error is a Supabase error
 */
function isSupabaseError(error: unknown): error is { message: string; code?: string; details?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

/**
 * Transform Supabase errors into AppError format
 */
function transformSupabaseError(error: { message: string; code?: string; details?: string }): AppError {
  const timestamp = new Date();

  // Handle specific Supabase error codes
  if (error.code === 'PGRST116') {
    return {
      type: ErrorType.NOT_FOUND_ERROR,
      message: 'The requested resource was not found.',
      details: error.details || error.message,
      timestamp,
    };
  }

  if (error.code === '23505') {
    return {
      type: ErrorType.CONFLICT_ERROR,
      message: 'A record with this information already exists.',
      details: error.details || error.message,
      timestamp,
    };
  }

  if (error.code === '23503') {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message: 'Invalid reference. The related record does not exist.',
      details: error.details || error.message,
      timestamp,
    };
  }

  if (error.code === '42501') {
    return {
      type: ErrorType.AUTHORIZATION_ERROR,
      message: 'You do not have permission to perform this action.',
      details: error.details || error.message,
      timestamp,
    };
  }

  // Default Supabase error
  return {
    type: ErrorType.DATABASE_ERROR,
    message: error.message || 'A database error occurred.',
    details: error.details,
    timestamp,
  };
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.VALIDATION_ERROR:
      return error.message || 'Please check your input and try again.';
    case ErrorType.AUTHENTICATION_ERROR:
      return 'Your session has expired. Please log in again.';
    case ErrorType.AUTHORIZATION_ERROR:
      return 'You do not have permission to perform this action.';
    case ErrorType.NETWORK_ERROR:
      return 'Network connection failed. Please check your internet connection and try again.';
    case ErrorType.DATABASE_ERROR:
      return error.message || 'A database error occurred. Please try again later.';
    case ErrorType.NOT_FOUND_ERROR:
      return 'The requested resource was not found.';
    case ErrorType.CONFLICT_ERROR:
      return 'A conflict occurred. The resource may already exist.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Log error to console in development
 */
export function logError(error: AppError): void {
  if (import.meta.env.DEV) {
    console.error('[HMS Error]', {
      type: error.type,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
    });
  }
}

/**
 * Create a validation error
 */
export function createValidationError(message: string, details?: any): AppError {
  return {
    type: ErrorType.VALIDATION_ERROR,
    message,
    details,
    timestamp: new Date(),
  };
}

/**
 * Create a network error
 */
export function createNetworkError(message?: string, details?: any): AppError {
  return {
    type: ErrorType.NETWORK_ERROR,
    message: message || 'Network connection failed.',
    details,
    timestamp: new Date(),
  };
}

/**
 * Create an authorization error
 */
export function createAuthorizationError(message?: string, details?: any): AppError {
  return {
    type: ErrorType.AUTHORIZATION_ERROR,
    message: message || 'You do not have permission to perform this action.',
    details,
    timestamp: new Date(),
  };
}
