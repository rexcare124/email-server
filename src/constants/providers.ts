export const EMAIL_PROVIDERS = Object.freeze({
  BREVO: {
    name: 'brevo',
    sendUrl: 'https://api.brevo.com/v3/smtp/email',
  },
  RESEND: {
    name: 'resend',
    sendUrl: 'https://api.resend.com/emails',
  },
} as const);
