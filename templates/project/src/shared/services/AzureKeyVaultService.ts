// src/shared/services/AzureKeyVaultService.ts

import { SecretClient } from '@azure/keyvault-secrets';
import { ClientSecretCredential } from '@azure/identity';
import { LRUCache } from 'lru-cache';
import config from '../../config/envConfig';
import logger from '../../core/logger';
import { AzureKeyVaultServiceError } from '../errors/ErrorResponse';

class AzureKeyVaultService {
    private client: SecretClient;
    private cache: LRUCache<string, string>;

    constructor() {
        const credential = new ClientSecretCredential(
            config.azure.tenantId,
            config.azure.clientId,
            config.azure.clientSecret
        );
        const keyVaultUrl = `https://${config.azure.keyVaultName}.vault.azure.net`;
        this.client = new SecretClient(keyVaultUrl, credential);

        this.cache = new LRUCache<string, string>({
            max: 500,
            ttl: 60 * 60 * 1000, // Cache TTL: 1 hour
        });
    }

    public async getSecret(secretName: string): Promise<string> {
        // Check cache first
        const cachedData = this.cache.get(secretName);
        if (cachedData) {
            logger.debug(`Cache hit for secret: ${secretName}`);
            return cachedData;
        }

        logger.debug(`Cache miss for secret: ${secretName}. Fetching from Azure Key Vault.`);
        try {
            const secret = await this.client.getSecret(secretName);

            // Cache the secret value
            this.cache.set(secretName, secret.value!);

            // Return the secret value
            return secret.value!;
        } catch (error: any) {
            if (error.code === 'SecretNotFound' || error.statusCode === 404) {
                logger.error(`Secret ${secretName} not found in Azure Key Vault.`);
                throw new AzureKeyVaultServiceError(`Secret ${secretName} not found in Azure Key Vault.`, 404);
            } else {
                logger.error(`Error retrieving secret ${secretName} from Azure Key Vault: ${error.message}`);
                throw new AzureKeyVaultServiceError(
                    `Error retrieving secret ${secretName} from Azure Key Vault.`,
                    error.statusCode || 500
                );
            }
        }
    }

    public async setSecret(secretName: string, secretValue: string): Promise<void> {
        try {
            await this.client.setSecret(secretName, secretValue);
            // Update the cache
            this.cache.set(secretName, secretValue);
        } catch (error: any) {
            logger.error(`Error setting secret ${secretName} in Azure Key Vault: ${error.message}`);
            throw new AzureKeyVaultServiceError(
                `Error setting secret ${secretName} in Azure Key Vault.`,
                error.statusCode || 500
            );
        }
    }
}

const azureKeyVaultService = new AzureKeyVaultService();

export default azureKeyVaultService;
