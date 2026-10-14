import { EMAIL_PROVIDERS } from '../constants/index.js';
import { postJson } from '../utils/index.js';
import type Email from '../models/email.model.js';
import type { EmailAddress, SendResult } from '../types/index.js';

const { BREVO } = EMAIL_PROVIDERS;

interface BrevoPayload {
  sender: EmailAddress;
  to: EmailAddress[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  replyTo?: EmailAddress;
}

interface BrevoResponse {
  messageId?: string;
}

const toBrevoPayload = (email: Email): BrevoPayload => {
  const payload: BrevoPayload = {
    sender: email.from,
    to: email.to,
    subject: email.subject,
  };

  if (email.html) payload.htmlContent = email.html;
  if (email.text) payload.textContent = email.text;
  if (email.cc.length) payload.cc = email.cc;
  if (email.bcc.length) payload.bcc = email.bcc;
  if (email.replyTo) payload.replyTo = email.replyTo;

  return payload;
};

export const sendEmail = async (email: Email): Promise<SendResult> => {
  const data = await postJson<BrevoResponse | null>(BREVO.sendUrl, toBrevoPayload(email), {
    headers: { 'api-key': email.apiKey },
    provider: BREVO.name,
  });

  return { provider: BREVO.name, id: data?.messageId ?? null, raw: data };
};
