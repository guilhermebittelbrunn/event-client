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
import { localStorage } from '../utils/helpers/localStorage';
import { isTokenExpired } from '../utils/helpers/token';

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

        this.setupInterceptors();
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

    private setupInterceptors(): void {
        this.restClient.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');

                if (accessToken && !isTokenExpired(accessToken)) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                    config.headers['Refresh-Token'] = `Refresh ${refreshToken}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        this.restClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('token-expired'));
                    }
                }
                return Promise.reject(error);
            },
        );
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

    public logout(): void {
        this.removeHeader('Authorization');
        this.removeHeader('Refresh-Token');

        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    public removeHeader(key: string): void {
        this.restClient.defaults.headers.common[key] = undefined;
        this.workerClient.defaults.headers.common[key] = undefined;
    }

    public async request<T>(client: AxiosInstance, config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            const response = await client.request<T>(config);
            return response;
        } catch (error) {
            console.error(error);
            throw new FormattedError(error);
        }
    }
}
