import fetch from 'node-fetch';

/**
 * Backend handler for processing and forwarding events to webhook
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export async function handleEvent(req, res) {
  try {
    // Validate the request (auth, data format, etc.)
    if (!isValidRequest(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Add source information server-side
    const webhookData = {
      ...req.body,
      source: req.headers.origin || req.ip
    };

    // Send to webhook using private API key
    const response = await fetch('https://webhook-receiver.netlify.app/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WEBHOOK_API_KEY // Stored securely in environment variables
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function isValidRequest(req) {
  // Implement your authentication/validation logic
  // Examples:
  // - Check session tokens
  // - Validate API keys
  // - Verify request origin
  return true; // Replace with actual validation
}