import axios, { AxiosInstance } from 'axios';
import AuthService from '../services/auth/service';
import EventService from '../services/event/service';
import { clearCookies, getCookie } from '@/shared/utils/helpers/cookies';
import { DEVELOPMENT_API_URL } from '@/shared/utils';
import FormattedError from '@/shared/utils/helpers/formattedError';
import MemoryService from '../services/memory/service';

class EventClient {
    readonly client: AxiosInstance;

    readonly authService: AuthService;
    readonly eventService: EventService;
    readonly memoryService: MemoryService;

    constructor() {
        this.client = this.buildClient();

        this.authService = new AuthService(this.client);
        this.eventService = new EventService(this.client);
        this.memoryService = new MemoryService(this.client);
    }

    private buildClient() {
        const api = axios.create({
            baseURL: `${DEVELOPMENT_API_URL}/v1`,
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
            },
        });

        api.interceptors.request.use((config) => {
            if (typeof window !== 'undefined') {
                //only on client
                const eventToken = getCookie('eventToken');

                if (eventToken) {
                    config.headers['event-token'] = eventToken;
                }
            }

            return config;
        });

        api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    clearCookies();
                    window.location.href = '/';
                }

                return Promise.reject(new FormattedError(error));
            },
        );

        return api;
    }
}

const eventClient = new EventClient();

export default eventClient;
