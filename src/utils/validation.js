import Joi from 'joi';

const eventSchema = Joi.object({
  activity: Joi.string().required(),
  datestamp: Joi.date().iso().required(),
  customer: Joi.string().required()
});

export function validateEventData(data) {
  return eventSchema.validate(data);
}

export function validateApiKey(apiKey) {
  return typeof apiKey === 'string' && apiKey.length > 0;
}

export function validateOrigin(origin, allowedOrigins) {
  return allowedOrigins.includes(origin);
}