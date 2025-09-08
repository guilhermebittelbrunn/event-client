import axios, { AxiosInstance } from 'axios';
import AuthService from '../services/auth/service';
import EventService from '../services/event/service';
import UserService from '../services/user/service';
import { getCookie, removeCookie } from '@/shared/utils/helpers/cookies';
import FormattedError from '@/shared/utils/helpers/formattedError';
import MemoryService from '../services/memory/service';

class EventClient {
    readonly client: AxiosInstance;

    readonly authService: AuthService;
    readonly userService: UserService;
    readonly eventService: EventService;
    readonly memoryService: MemoryService;

    constructor() {
        this.client = this.buildClient();

        this.authService = new AuthService(this.client);
        this.userService = new UserService(this.client);
        this.eventService = new EventService(this.client);
        this.memoryService = new MemoryService(this.client);
    }

    private buildClient() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const api = axios.create({
            baseURL: `${apiUrl}/v1`,
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
                const eventToken = getCookie('eventToken');

                if (eventToken) {
                    config.headers['event-token'] = eventToken;
                }
            }

            return config;
        });
    }

    private setupResponse(client: AxiosInstance) {
        client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    removeCookie('eventToken');
                    window.location.href = '/';
                }

                return Promise.reject(new FormattedError(error));
            },
        );
    }
}

const eventClient = new EventClient();

export default eventClient;
