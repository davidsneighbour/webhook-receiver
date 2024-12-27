import { validateEventData } from '../../src/utils/validation.js';
import { isValidRequest } from '../../src/utils/security.js';
import { sendWebhook } from '../../src/services/webhookService.js';

export async function handler(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Validate request
    if (!isValidRequest(event)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Parse and validate payload
    const payload = JSON.parse(event.body);
    const { error: validationError } = validateEventData(payload);
    
    if (validationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validationError.details[0].message })
      };
    }

    // Add source information
    const webhookData = {
      ...payload,
      source: event.headers.origin || event.headers['client-ip']
    };

    // Send webhook with retry logic
    const result = await sendWebhook(webhookData, process.env.WEBHOOK_API_KEY);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}