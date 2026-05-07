import logger from "./logger";

/**
 * Error Handler Utility
 * Centralized error handling and formatting
 */

export class APIError extends Error {
  constructor(message, status = null, data = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

export class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message = "You do not have permission to perform this action") {
    super(message);
    this.name = "AuthorizationError";
  }
}

const errorHandler = {
  /**
   * Handle API errors
   */
  handleAPIError: (error) => {
    logger.error("API Error:", error);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return new ValidationError("Invalid request", data);
        case 401:
          return new AuthenticationError("Please log in again");
        case 403:
          return new AuthorizationError();
        case 404:
          return new APIError("Resource not found", status, data);
        case 500:
          return new APIError("Server error. Please try again later", status, data);
        default:
          return new APIError(data?.message || "An error occurred", status, data);
      }
    }

    if (error.request) {
      return new APIError("Network error. Please check your connection");
    }

    return new APIError(error.message || "An unexpected error occurred");
  },

  /**
   * Format error message for display
   */
  formatErrorMessage: (error) => {
    if (error instanceof ValidationError) {
      return Object.values(error.errors).join(", ");
    }

    if (error instanceof APIError || error instanceof AuthenticationError || error instanceof AuthorizationError) {
      return error.message;
    }

    return error.message || "An unexpected error occurred";
  },

  /**
   * Get error details
   */
  getErrorDetails: (error) => {
    return {
      name: error.name,
      message: error.message,
      status: error.status,
      data: error.data,
      errors: error.errors,
    };
  },

  /**
   * Is error retryable
   */
  isRetryable: (error) => {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      return false;
    }

    if (error instanceof APIError) {
      // Retry on 5xx errors and network errors
      return !error.status || error.status >= 500;
    }

    return true;
  },
};

export default errorHandler;
