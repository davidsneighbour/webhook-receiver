import pino from 'pino';
import { saveLog } from '../database.js';

// Create a Pino logger instance
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
});

// Custom logging function that logs to both console and database
export async function log(level, message, metadata = {}) {
  // Log to console
  logger[level](metadata, message);

  try {
    // Log to database
    await saveLog({ level, message, metadata });
  } catch (error) {
    logger.error('Failed to save log to database:', error);
  }
}

export const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const metadata = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    const level = res.statusCode >= 400 ? 'error' : 'info';
    log(level, `${req.method} ${req.url}`, metadata);
  });

  next();
};