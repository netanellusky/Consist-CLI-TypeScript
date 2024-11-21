import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import logger from "../../../core/logger";
import getGlassixToken from "./glassixToken";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    reqId?: string;
    startTime?: number;
}

const createLogMessage = (reqId: string, startTime: number, response: AxiosResponse | undefined, method: string, url: string, status: number | string, body: any, logType: 'info' | 'error') => {
    const duration = Date.now() - startTime;
    const message = {
        reqId,
        time: Date.now(),
        duration,
        url,
        method,
        status,
        body,
        logMessage: logType === 'info' ? 'RESPONSE RECEIVED' : 'ERROR',
    };

    return JSON.stringify(message);
};

const axiosInstance: AxiosInstance = axios.create({
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((request) => {
    const requestId = uuidv4();
    const requestConfig = request as CustomAxiosRequestConfig;
    requestConfig.reqId = requestId;
    requestConfig.startTime = Date.now();

    const message = createLogMessage(requestId, requestConfig.startTime, undefined, request.method ?? '', request.url ?? '', '', request.data, 'info');
    logger.info(message);

    return request;
});

axiosInstance.interceptors.response.use(
    (response) => {
        const requestConfig = response.config as CustomAxiosRequestConfig;
        const requestId = requestConfig.reqId ?? '';
        const message = createLogMessage(requestId, requestConfig.startTime ?? Date.now(), response, response.config.method ?? '', response.config.url ?? '', response.status, null, 'info');
        logger.info(message);

        return response;
    },
    (error) => {
        const requestConfig = error.config as CustomAxiosRequestConfig | undefined;
        const requestId = requestConfig?.reqId ?? '';
        const url = requestConfig?.url ?? '';
        const method = requestConfig?.method ?? '';
        const startTime = requestConfig?.startTime ?? Date.now();
        const status = error.response?.status ?? 'UNKNOWN';
        const errorBody = error.response?.data ?? null;

        const message = createLogMessage(requestId, startTime, undefined, method, url, status, errorBody, 'error');

        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            logger.error(`REQUEST TIMED OUT: ${message}`);
            error.isTimeout = true;
        } else {
            logger.error(message);
        }

        return Promise.reject(error);
    },
);

async function getAxiosConfig(departmentId: string, owner: string | null = null): Promise<AxiosRequestConfig> {
    const { workspace, access_token } = await getGlassixToken(departmentId, owner);
    return {
        baseURL: `https://${workspace}.glassix.com/api/v1.2`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    };
}

export { axiosInstance, getAxiosConfig };
