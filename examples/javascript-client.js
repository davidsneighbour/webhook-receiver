/**
 * Send a webhook using vanilla JavaScript fetch
 * @param {string} webhookUrl - The webhook endpoint URL
 * @param {string} apiKey - Your API key
 * @param {Object} data - The webhook payload
 * @returns {Promise<Object>} The webhook response
 */
async function sendWebhook(webhookUrl, apiKey, data) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Usage example
const webhookData = {
  activity: 'user.created',
  datestamp: new Date().toISOString(),
  customer: 'customer123',
  source: 'https://trusted-source.com'
};

// Example usage
sendWebhook(
  'https://your-site.netlify.app/api/webhook',
  'your-api-key',
  webhookData
)
  .then(response => console.log('Webhook sent:', response))
  .catch(error => console.error('Error:', error));