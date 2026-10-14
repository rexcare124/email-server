import { HTTP_STATUS } from '../constants/index.js';

export default class ApiError extends Error {
  readonly statusCode: number;
  readonly details: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, details);
  }

  static notFound(message: string, details?: unknown): ApiError {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message, details);
  }
}
