import type { Request, Response } from 'express';
import Email from '../models/email.model.js';
import { brevoService, resendService } from '../services/index.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import { sendSuccess } from '../utils/index.js';
import type { EmailService } from '../types/index.js';

const buildSendHandler = (service: EmailService) => async (req: Request, res: Response) => {
  const email = Email.fromRequest(req.body);
  const result = await service.sendEmail(email);

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: MESSAGES.EMAIL_SENT,
    data: result,
  });
};

export const sendWithBrevo = buildSendHandler(brevoService);
export const sendWithResend = buildSendHandler(resendService);
