import { createClient } from '@supabase/supabase-js';
import { validateWebhookPayload } from '../../src/utils/validation.js';
import { log } from '../../src/utils/logger.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ALLOWED_SOURCES = process.env.ALLOWED_SOURCES 
  ? process.env.ALLOWED_SOURCES.split(',') 
  : [];

export const handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Validate API key
    const apiKey = event.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      await log('warn', 'Invalid API key attempt', { 
        ip: event.headers['client-ip']
      });
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid API key' })
      };
    }

    // Validate source
    const source = event.headers['origin'] || event.headers['client-ip'];
    if (ALLOWED_SOURCES.length > 0 && !ALLOWED_SOURCES.includes(source)) {
      await log('warn', 'Unauthorized source attempt', { source });
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Unauthorized source' })
      };
    }

    // Parse and validate payload
    const payload = JSON.parse(event.body);
    const { error: validationError } = validateWebhookPayload(payload);
    if (validationError) {
      await log('warn', 'Invalid payload', { 
        error: validationError.details[0].message,
        payload 
      });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validationError.details[0].message })
      };
    }

    // Save webhook
    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    await log('info', 'Webhook processed successfully', {
      webhookId: webhook.id,
      customer: payload.customer,
      activity: payload.activity
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Webhook received and processed',
        id: webhook.id
      })
    };

  } catch (error) {
    await log('error', 'Error processing webhook', {
      error: error.message,
      payload: event.body
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};