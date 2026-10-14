import { EMAIL_PROVIDERS } from '../constants/index.js';
import { postJson } from '../utils/index.js';
import type Email from '../models/email.model.js';
import type { EmailAddress, SendResult } from '../types/index.js';

const { RESEND } = EMAIL_PROVIDERS;

interface ResendPayload {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
  reply_to?: string;
}

interface ResendResponse {
  id?: string;
}

/** Resend expects addresses as "Name <email>" strings. */
const formatAddress = ({ email, name }: EmailAddress): string => (name ? `${name} <${email}>` : email);

const toResendPayload = (email: Email): ResendPayload => {
  const payload: ResendPayload = {
    from: formatAddress(email.from),
    to: email.to.map(formatAddress),
    subject: email.subject,
  };

  if (email.html) payload.html = email.html;
  if (email.text) payload.text = email.text;
  if (email.cc.length) payload.cc = email.cc.map(formatAddress);
  if (email.bcc.length) payload.bcc = email.bcc.map(formatAddress);
  if (email.replyTo) payload.reply_to = formatAddress(email.replyTo);

  return payload;
};

export const sendEmail = async (email: Email): Promise<SendResult> => {
  const data = await postJson<ResendResponse | null>(RESEND.sendUrl, toResendPayload(email), {
    headers: { Authorization: `Bearer ${email.apiKey}` },
    provider: RESEND.name,
  });

  return { provider: RESEND.name, id: data?.id ?? null, raw: data };
};
