import axios from 'axios';
import azureKeyVaultService from '../../../shared/services/AzureKeyVaultService';
import { LRUCache } from 'lru-cache';
import logger from '../../../core/logger';
import { ErrorResponse } from '../../../middleware/errorMiddleware';
import { TokenGlassixRequest, TokenGlassix, TokenGlassixResponse } from '../interfaces';
import { DepartmentData } from '../interfaces/departmentData';

const MAX_CACHE_ENTRIES = 500;
const BUFFER_TIME = 5 * 60 * 1000; // 5 minutes

const tokenCache = new LRUCache<string, TokenGlassix>({ max: MAX_CACHE_ENTRIES });

const getGlassixToken = async (departmentId: string, user: string | null): Promise<TokenGlassix> => {
    logger.debug(`Starting getGlassixToken for departmentId: ${departmentId}`);

    try {
        const cacheKey = `${departmentId}_${user}`;
        let token = tokenCache.get(cacheKey);
        if (token) {
            return token;
        }

        logger.debug(
            `Token for departmentId: ${departmentId} not found in cache. Fetching new token.`
        );

        // Fetch the secret from Azure Key Vault
        const departmentSecret = await azureKeyVaultService.getSecret(`secret-${departmentId}`);

        if (!departmentSecret) {
            throw new ErrorResponse(`Department with id ${departmentId} not found`, 404);
        }

        // Parse the secret into DepartmentData
        let departmentData: DepartmentData;
        try {
            departmentData = JSON.parse(departmentSecret);
        } catch (parseError) {
            logger.error(`Failed to parse department data for departmentId: ${departmentId}: ${(parseError as Error).message}`);
            throw new ErrorResponse('Invalid department data format', 500);
        }

        const userName = user || departmentData.userName;

        const response = await axios.post<TokenGlassixResponse>(
            `https://${departmentData.workspace}.glassix.com/api/v1.2/token/get`,
            {
                apiKey: departmentData.apiKey,
                apiSecret: departmentData.apiSecret,
                userName,
            } as TokenGlassixRequest
        );

        if (!response || !response.data) {
            throw new ErrorResponse('Failed to get token from Glassix API', 500);
        }

        token = { ...response.data, workspace: departmentData.workspace };
        logger.debug(
            `Received new token for departmentId: ${departmentId} and user: ${userName}`
        );

        if (!token) {
            throw new ErrorResponse('Token expiration time not provided', 500);
        }

        const tokenTTL = token.expires_in * 1000 - BUFFER_TIME;
        tokenCache.set(cacheKey, token, { ttl: tokenTTL });

        return token;
    } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        logger.error(
            `Error in getGlassixToken for departmentId: ${departmentId}: ${errorMessage}`
        );
        throw new ErrorResponse(errorMessage, error.statusCode || 500);
    }
};

export default getGlassixToken;
