import * as winston from 'winston';

export const winstonConfig = {
  defaultMeta: { service: 'task-manager-api' },

  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),

  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${String(timestamp)} [${level}]: ${String(message)} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`,
        ),
      ),
    }),

    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ]
      : []),
  ],
};
