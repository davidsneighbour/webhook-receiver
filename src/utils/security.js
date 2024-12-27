import { validateApiKey, validateOrigin } from './validation.js';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

export function isValidRequest(req) {
  // Check for required headers
  if (!req.headers['x-client-id'] || !req.headers['x-client-token']) {
    return false;
  }

  // Validate origin
  const origin = req.headers.origin || req.ip;
  if (!validateOrigin(origin, ALLOWED_ORIGINS)) {
    return false;
  }

  // Additional security checks can be added here
  return true;
}

export function generateRequestHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  };
}