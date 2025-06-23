import pino from 'pino-http';

const logger = pino({
  transport: {
    target: 'pino-pretty',
        options: {
      colorize: true,
      translateTime: 'HH:MM:ss.l',
      ignore: 'pid,hostname',
    },
  },
});

export function loggerMiddleware(req, res, next) {
  logger(req, res); 
  next();
}
