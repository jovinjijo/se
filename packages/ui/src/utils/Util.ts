import { HoldingsData } from '@se/core';

export function getErrorMessage(response: any): string | null {
  if (response.errors && response.errors.length > 0) {
    return `${response.message}: ${response.errors[0]}`;
  }
  if (response.message) {
    return response.message;
  }
  return null;
}

type Method = 'GET' | 'POST';

interface Body {
  [key: string]: string | number | undefined | Body;
}

export function apiCall(endpoint: string, method: Method, body?: Body) {
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
