import logger from '../../core/logger';
import redisClient from '../../config/redisConfig'

const setCache = async (key: string, value: string, ttlSeconds: number): Promise<void> => {
    try {
        await redisClient.set(key, value, 'EX', ttlSeconds);
        logger.verbose(`Set cache for key: ${key} with TTL: ${ttlSeconds}s`);
    } catch (error) {
        logger.error(`Error setting cache for key ${key}:`, error);
        throw error;
    }
};

const getCache = async (key: string): Promise<string | null> => {
    try {
        const value = await redisClient.get(key);
        logger.verbose(`Retrieved cache for key: ${key}`);
        return value;
    } catch (error) {
        logger.error(`Error retrieving cache for key ${key}:`, error);
        throw error;
    }
};

const deleteCache = async (key: string): Promise<void> => {
    try {
        await redisClient.del(key);
        logger.verbose(`Deleted cache for key: ${key}`);
    } catch (error) {
        logger.error(`Error deleting cache for key ${key}:`, error);
        throw error;
    }
};

export { setCache, getCache, deleteCache };
