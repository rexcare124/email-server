export const MESSAGES = Object.freeze({
  EMAIL_SENT: 'Email sent successfully',
  ROUTE_NOT_FOUND: 'Route not found',
  VALIDATION_FAILED: 'Validation failed',
  INVALID_JSON: 'Request body must be valid JSON',
  INTERNAL_ERROR: 'Internal server error',
  PROVIDER_ERROR: 'Email provider rejected the request',
  PROVIDER_TIMEOUT: 'Email provider did not respond in time',
  PROVIDER_UNREACHABLE: 'Could not reach email provider',
} as const);
