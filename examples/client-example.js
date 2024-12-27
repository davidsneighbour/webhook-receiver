/**
 * Example client implementation for sending events
 */
async function sendEvent(apiUrl, clientId, clientToken, eventData) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': clientId,
        'X-Client-Token': clientToken
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to send event:', error);
    throw error;
  }
}

// Usage example
const eventData = {
  activity: 'user.created',
  datestamp: new Date().toISOString(),
  customer: 'customer123'
};

sendEvent(
  'https://your-site.netlify.app/.netlify/functions/processEvent',
  'your-client-id',
  'your-client-token',
  eventData
)
  .then(response => console.log('Event sent:', response))
  .catch(error => console.error('Error:', error));