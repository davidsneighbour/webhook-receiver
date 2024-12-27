import { Router } from 'express';
import { saveWebhook, getWebhooks } from '../database.js';
import { log } from '../utils/logger.js';

export const webhookRouter = Router();

webhookRouter.post('/', async (req, res) => {
  try {
    const webhook = await saveWebhook(req.body);
    await log('info', 'Webhook processed successfully', {
      webhookId: webhook.id,
      customer: req.body.customer,
      activity: req.body.activity
    });
    
    res.status(201).json({ 
      message: 'Webhook received and processed',
      id: webhook.id
    });
  } catch (error) {
    await log('error', 'Error processing webhook', {
      error: error.message,
      payload: req.body
    });
    
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

webhookRouter.get('/', async (req, res) => {
  try {
    const webhooks = await getWebhooks();
    await log('info', 'Webhooks retrieved', { count: webhooks.length });
    res.json(webhooks);
  } catch (error) {
    await log('error', 'Error fetching webhooks', { error: error.message });
    console.error('Error fetching webhooks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});