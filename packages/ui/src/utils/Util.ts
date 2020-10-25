import { HoldingsData } from '@se/core';
import { ResponseBody, ErrorResponse } from '@se/api';

export function getErrorMessage(response: ResponseBody): string | null {
  const errorResponse = response as ErrorResponse;
  if (errorResponse && Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0) {
    return `${errorResponse.errors[0]}`;
  }
  if (errorResponse && errorResponse.message) {
    return errorResponse.message;
  }
  return null;
}

type Method = 'GET' | 'POST';

interface Body {
  [key: string]: string | number | undefined | Date | Body | Body[];
}

export function apiCall(endpoint: string, method: Method, body?: Body): Promise<ResponseBody> {
  return fetch(endpoint, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((response) => response.json());
}

export const sampleHoldings: HoldingsData = {
  AMZN: 200,
  RIL: 300,
  TSLA: 1200,
};
