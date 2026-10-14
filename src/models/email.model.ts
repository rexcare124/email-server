import { ApiError, isHtml, isNonEmptyString, isValidEmail, toArray } from '../utils/index.js';
import { MESSAGES } from '../constants/index.js';
import type { EmailAddress } from '../types/index.js';

interface ValidationIssue {
  field: string;
  message: string;
}

type EmailProps = Pick<Email, 'apiKey' | 'from' | 'to' | 'cc' | 'bcc' | 'replyTo' | 'subject' | 'html' | 'text'>;

const validateEmailList = (value: unknown, field: string, errors: ValidationIssue[]): EmailAddress[] =>
  toArray(value).flatMap((item, index) => {
    if (!isValidEmail(item)) {
      errors.push({ field: `${field}[${index}]`, message: 'must be a valid email address' });
      return [];
    }
    return [{ email: item.trim() }];
  });

export default class Email {
  readonly apiKey: string;
  readonly from: EmailAddress;
  readonly to: EmailAddress[];
  readonly cc: EmailAddress[];
  readonly bcc: EmailAddress[];
  readonly replyTo: EmailAddress | null;
  readonly subject: string;
  readonly html: string | undefined;
  readonly text: string | undefined;

  constructor(props: EmailProps) {
    this.apiKey = props.apiKey;
    this.from = props.from;
    this.to = props.to;
    this.cc = props.cc;
    this.bcc = props.bcc;
    this.replyTo = props.replyTo;
    this.subject = props.subject;
    this.html = props.html;
    this.text = props.text;
  }

  /**
   * Validates a raw request body (see SendEmailBody) and returns an Email,
   * or throws a 400 ApiError listing every invalid field.
   */
  static fromRequest(rawBody: unknown): Email {
    const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as Record<string, unknown>;
    const errors: ValidationIssue[] = [];

    const { apiKey, fromEmail, fromName, toEmail, cc, bcc, replyTo, title, content } = body;

    if (!isNonEmptyString(apiKey)) {
      errors.push({ field: 'apiKey', message: 'is required' });
    }

    if (!isValidEmail(fromEmail)) {
      errors.push({ field: 'fromEmail', message: 'must be a valid email address' });
    }

    if (fromName !== undefined && typeof fromName !== 'string') {
      errors.push({ field: 'fromName', message: 'must be a string' });
    }

    const to = validateEmailList(toEmail, 'toEmail', errors);
    if (toArray(toEmail).length === 0) {
      errors.push({ field: 'toEmail', message: 'is required' });
    }

    const ccList = validateEmailList(cc, 'cc', errors);
    const bccList = validateEmailList(bcc, 'bcc', errors);

    if (replyTo !== undefined && !isValidEmail(replyTo)) {
      errors.push({ field: 'replyTo', message: 'must be a valid email address' });
    }

    if (!isNonEmptyString(title)) {
      errors.push({ field: 'title', message: 'is required' });
    }

    if (!isNonEmptyString(content)) {
      errors.push({ field: 'content', message: 'is required' });
    }

    if (
      errors.length > 0 ||
      !isNonEmptyString(apiKey) ||
      !isValidEmail(fromEmail) ||
      !isNonEmptyString(title) ||
      !isNonEmptyString(content)
    ) {
      throw ApiError.badRequest(MESSAGES.VALIDATION_FAILED, errors);
    }

    const from: EmailAddress = { email: fromEmail.trim() };
    if (isNonEmptyString(fromName)) from.name = fromName.trim();

    const contentIsHtml = isHtml(content);

    return new Email({
      apiKey: apiKey.trim(),
      from,
      to,
      cc: ccList,
      bcc: bccList,
      replyTo: isValidEmail(replyTo) ? { email: replyTo.trim() } : null,
      subject: title.trim(),
      html: contentIsHtml ? content : undefined,
      text: contentIsHtml ? undefined : content,
    });
  }
}
