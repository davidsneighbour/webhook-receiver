import Joi from 'joi';

const webhookSchema = Joi.object({
  activity: Joi.string().required(),
  datestamp: Joi.date().iso().required(),
  customer: Joi.string().required(),
  source: Joi.string().required()
});

const ALLOWED_SOURCES = process.env.ALLOWED_SOURCES 
  ? process.env.ALLOWED_SOURCES.split(',') 
  : [];

export function validateWebhook(req, res, next) {
  // Validate API key
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Validate source IP/domain
  const source = req.headers['origin'] || req.ip;
  if (ALLOWED_SOURCES.length > 0 && !ALLOWED_SOURCES.includes(source)) {
    return res.status(403).json({ error: 'Unauthorized source' });
  }

  // Validate payload
  const { error } = webhookSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}