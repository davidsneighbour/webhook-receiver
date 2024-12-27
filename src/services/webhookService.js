import { withRetry } from '../utils/retry.js';
import { generateRequestHeaders } from '../utils/security.js';
import { WEBHOOK_URL, MAX_RETRIES, RETRY_DELAY } from '../config/constants.js';

export async function sendWebhook(data, apiKey) {
  const headers = generateRequestHeaders(apiKey);
  
  return withRetry(
    async () => {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      return response.json();
    },
    MAX_RETRIES,
    RETRY_DELAY
  );
}