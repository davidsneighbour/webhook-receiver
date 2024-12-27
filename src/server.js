import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { validateWebhook } from './middleware/validateWebhook.js';
import { webhookRouter } from './routes/webhook.js';
import { loggerMiddleware } from './utils/logger.js';
import { log } from './utils/logger.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(loggerMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/webhook', limiter);

// Webhook route with validation
app.use('/webhook', validateWebhook, webhookRouter);

app.listen(PORT, () => {
  log('info', `Server running on port ${PORT}`);
});