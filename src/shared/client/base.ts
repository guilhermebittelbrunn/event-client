import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
    DEVELOPMENT_API_URL,
    DEVELOPMENT_WORKER_URL,
    PRODUCTION_API_URL,
    PRODUCTION_WORKER_URL,
    STAGING_API_URL,
    STAGING_WORKER_URL,
} from '../utils';
import FormattedError from '../utils/helpers/formattedError';

export interface ClientConfigWeb {
    tokenStorageKey: string;
    environment: 'development' | 'staging' | 'production';
}

export default class ClientBase {
    public config: ClientConfigWeb;

    private _userId: string | undefined;

    public restClient: AxiosInstance;

    public workerClient: AxiosInstance;

    constructor(config: ClientConfigWeb) {
        this.config = { ...config };

        const apiUrl = this.environmentApiUrl;

        this.restClient = axios.create({
            baseURL: `${apiUrl}/v1`,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const workerUrl = this.environmentWorkerUrl;

        this.workerClient = axios.create({
            baseURL: `${workerUrl}/v1`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    get userId(): string | undefined {
        if (!this._userId) {
            console.error('A userId must be informed before any function is executed.');
            return undefined;
        }

        return this._userId;
    }

    set userId(id: string | undefined) {
        this._userId = id;
    }

    private get environmentApiUrl(): string {
        // This sequence of precedence is important since we consider both NODE_ENV and APP_ENV
        // to validate env state, so, sometimes you can be at staging and production at the same time
        // and in that case, we want to use the staging url
        switch (this.config.environment) {
            case 'staging':
                return STAGING_API_URL;
            case 'production':
                return PRODUCTION_API_URL;
            default:
                return DEVELOPMENT_API_URL;
        }
    }

    private get environmentWorkerUrl(): string {
        switch (this.config.environment) {
            case 'staging':
                return STAGING_WORKER_URL;
            case 'production':
                return PRODUCTION_WORKER_URL;
            default:
                return DEVELOPMENT_WORKER_URL;
        }
    }

    public setHeader(key: string, value: string): void {
        this.restClient.defaults.headers.common[key] = value;
        this.workerClient.defaults.headers.common[key] = value;
    }

    public setHeaders(headers: Record<string, string>): void {
        for (const header in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, header)) {
                this.setHeader(header, headers[header]);
            }
        }
    }

    public removeHeader(key: string): void {
        this.restClient.defaults.headers.common[key] = undefined;
        this.workerClient.defaults.headers.common[key] = undefined;
    }

    public request<T>(client: AxiosInstance, config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return client.request<T>(config);
        } catch (error) {
            console.error(error);
            throw new FormattedError(error);
        }
    }
}
