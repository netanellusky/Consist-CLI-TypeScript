// src/config/envConfig.ts

import dotenv from 'dotenv';
import logger from '../core/logger';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Helper function to retrieve and validate required environment variables.
 * Logs an error and throws if a required variable is missing.
 */
function getEnvVar(name: string, isOptional = false, defaultValue?: string): string {
    const value = process.env[name] || defaultValue;
    if (!value && !isOptional) {
        logger.error(`Missing ${name} environment variable`);
        throw new Error(`Missing ${name} environment variable`);
    }
    return value || '';
}

const envConfig = {
    port: parseInt(getEnvVar('PORT', true, '3000')),
    nodeEnv: getEnvVar('NODE_ENV', true, 'development'),
    consistToken: getEnvVar('CONSIST_TOKEN', true),
    //SERVICE_CONFIGS_PLACEHOLDER
};

export default envConfig;
