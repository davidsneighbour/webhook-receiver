/**
 * Send data to your backend API
 * @param {string} apiUrl - Your backend API endpoint
 * @param {Object} data - The event data
 * @returns {Promise<Object>} The API response
 */
async function sendSecureWebhook(apiUrl, data) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // Include any client-side authentication as needed
    // credentials: 'include', // For cookies if using session auth
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Usage example
const eventData = {
  activity: 'user.created',
  datestamp: new Date().toISOString(),
  customer: 'customer123'
};

// Call your backend API instead of the webhook directly
sendSecureWebhook(
  'https://your-site.com/api/events', // Your backend API endpoint
  eventData
)
  .then(response => console.log('Event sent:', response))
  .catch(error => console.error('Error:', error));