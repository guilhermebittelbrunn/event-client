import axios, { AxiosInstance } from 'axios';
import AuthService from '../services/auth/service';
import EventService from '../services/event/service';
import UserService from '../services/user/service';
import { clearCookies, getCookie } from '@/shared/utils/helpers/cookies';
import { DEVELOPMENT_API_URL } from '@/shared/utils';
import FormattedError from '@/shared/utils/helpers/formattedError';

class Client {
    readonly client: AxiosInstance;

    readonly authService: AuthService;
    readonly userService: UserService;
    readonly eventService: EventService;

    constructor() {
        this.client = this.buildClient();

        this.authService = new AuthService(this.client);
        this.userService = new UserService(this.client);
        this.eventService = new EventService(this.client);
    }

    private buildClient() {
        const api = axios.create({
            baseURL: `${DEVELOPMENT_API_URL}/v1`,
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors(api);

        return api;
    }

    private setupInterceptors(client: AxiosInstance) {
        this.setupRequest(client);
        this.setupResponse(client);
    }

    private setupRequest(client: AxiosInstance) {
        client.interceptors.request.use((config) => {
            if (typeof window !== 'undefined') {
                //only on client
                const accessToken = getCookie('accessToken');
                const refreshToken = getCookie('refreshToken');

                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }

                if (refreshToken) {
                    config.headers['refresh-token'] = refreshToken;
                }
            }

            return config;
        });
    }

    private setupResponse(client: AxiosInstance) {
        client.interceptors.response.use(
            (response) => response,
            (error) => {
                console.log('client api error :>> ', error);
                if (error.response && error.response.status === 401) {
                    clearCookies();
                    window.location.href = '/entrar';
                }

                return Promise.reject(new FormattedError(error));
            },
        );
    }
}

const client = new Client();

export default client;
