import config from '../config/index.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import ApiError from './ApiError.js';

interface PostJsonOptions {
  headers?: Record<string, string>;
  provider?: string;
}

const parseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/**
 * POSTs JSON to an upstream provider and returns the parsed body.
 * Upstream failures are converted to ApiError so the error middleware can
 * forward the provider's status and message to the client.
 */
export const postJson = async <T = unknown>(
  url: string,
  body: unknown,
  { headers = {}, provider }: PostJsonOptions = {},
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(config.requestTimeoutMs),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new ApiError(HTTP_STATUS.GATEWAY_TIMEOUT, MESSAGES.PROVIDER_TIMEOUT, { provider });
    }
    throw new ApiError(HTTP_STATUS.BAD_GATEWAY, MESSAGES.PROVIDER_UNREACHABLE, {
      provider,
      reason: error instanceof Error ? error.message : String(error),
    });
  }

  const data = await parseBody(response);

  if (!response.ok) {
    const isClientError = response.status >= 400 && response.status < 500;
    throw new ApiError(
      isClientError ? response.status : HTTP_STATUS.BAD_GATEWAY,
      MESSAGES.PROVIDER_ERROR,
      { provider, providerStatus: response.status, providerResponse: data },
    );
  }

  return data as T;
};
