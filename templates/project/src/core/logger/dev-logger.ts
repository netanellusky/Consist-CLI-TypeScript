import winston from 'winston';

const { format, createLogger, transports } = winston
const { timestamp, combine, printf } = format


function buildDevLogger() {
  const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
  });

  return createLogger({
    level: 'debug',
    format: combine(
      format.colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    defaultMeta: { service: 'user-service' },
    transports: [new transports.Console()]
  });
}


export default buildDevLogger;