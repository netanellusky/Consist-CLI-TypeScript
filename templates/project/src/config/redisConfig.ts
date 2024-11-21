// config/redisConfig.ts
import Redis, { RedisOptions } from 'ioredis';
import logger from '../core/logger';
import config from './envConfig';

export const redisConnection: RedisOptions = {
    port: config.redis.port,
    host: config.redis.host,
    password: config.redis.password,
    tls: {
        rejectUnauthorized: false,
    },
};

const redisClient = new Redis(redisConnection);

redisClient.on('connect', () => {
    logger.info('Connected to Redis');
});

redisClient.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

export default redisClient;
