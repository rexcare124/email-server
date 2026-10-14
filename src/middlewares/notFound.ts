import type { RequestHandler } from 'express';
import { MESSAGES } from '../constants/index.js';
import { ApiError } from '../utils/index.js';

const notFound: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(MESSAGES.ROUTE_NOT_FOUND, { method: req.method, path: req.originalUrl }));
};

export default notFound;
