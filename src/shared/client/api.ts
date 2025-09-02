import axios from 'axios';
import { DEVELOPMENT_API_URL } from '../utils';
import { clearCookies, getCookie } from '../utils/helpers/cookies';
import FormattedError from '../utils/helpers/formattedError';

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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            clearCookies();
            window.location.href = '/entrar';
        }
        return Promise.reject(new FormattedError(error));
    },
);

export default api;
