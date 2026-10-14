import type Email from '../models/email.model.js';

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface SendEmailBody {
  apiKey: string;
  fromEmail: string;
  fromName?: string;
  toEmail: string | string[];
  title: string;
  content: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export interface SendResult {
  provider: string;
  id: string | null;
  raw: unknown;
}

export interface EmailService {
  sendEmail(email: Email): Promise<SendResult>;
}
