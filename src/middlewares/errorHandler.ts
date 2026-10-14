import type { ErrorRequestHandler } from 'express';
import config from '../config/index.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import { ApiError, sendError } from '../utils/index.js';

interface HttpLikeError {
  type?: string;
  status?: number;
  message?: string;
}

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof ApiError) {
    sendError(res, { statusCode: err.statusCode, message: err.message, details: err.details });
    return;
  }

  const httpError = (err ?? {}) as HttpLikeError;

  if (httpError.type === 'entity.parse.failed') {
    sendError(res, { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_JSON });
    return;
  }

  if (httpError.status && httpError.status >= 400 && httpError.status < 500) {
    sendError(res, { statusCode: httpError.status, message: httpError.message });
    return;
  }

  console.error(err);
  sendError(res, {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: MESSAGES.INTERNAL_ERROR,
    details: config.isProduction ? undefined : httpError.message,
  });
};

export default errorHandler;
