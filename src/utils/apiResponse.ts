import type { Response } from 'express';

interface SuccessOptions {
  statusCode?: number;
  message?: string;
  data?: unknown;
}

interface ErrorOptions {
  statusCode?: number;
  message?: string;
  details?: unknown;
}

export const sendSuccess = (res: Response, { statusCode = 200, message, data }: SuccessOptions = {}) =>
  res.status(statusCode).json({ success: true, message, data });

export const sendError = (res: Response, { statusCode = 500, message, details }: ErrorOptions = {}) =>
  res.status(statusCode).json({ success: false, message, details });
