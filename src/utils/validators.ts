const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const isValidEmail = (value: unknown): value is string =>
  isNonEmptyString(value) && EMAIL_REGEX.test(value.trim());

export const isHtml = (value: string): boolean => /<[a-z][\s\S]*>/i.test(value);

/** Accepts a single value or an array and always returns an array. */
export const toArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
};
