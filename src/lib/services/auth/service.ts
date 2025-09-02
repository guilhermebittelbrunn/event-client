import { UserDTO } from '@/shared/types/dtos';
import { RefreshTokenResponse, SignInRequest, SignInResponse, SignUpRequest } from './types';
import api from '@/shared/client/api';

export default class AuthService {
    private readonly baseUrl = '/auth';

    constructor() {}

    async signUp(dto: SignUpRequest): Promise<UserDTO> {
        const { data } = await api.post<UserDTO>(`${this.baseUrl}/sign-up`, dto);

        return data;
    }

    async signIn(dto: SignInRequest): Promise<SignInResponse> {
        const { data } = await api.post<SignInResponse>(`${this.baseUrl}/sign-in`, dto);

        localStorage.setItem('accessToken', data.meta.tokens.accessToken);
        localStorage.setItem('refreshToken', data.meta.tokens.refreshToken || '');

        api.defaults.headers.common = {
            Authorization: `Bearer ${data.meta.tokens.accessToken}`,
            'Refresh-Token': `${data.meta.tokens.refreshToken}`,
        };

        return data;
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        console.log('namoral????');

        const { data } = await api.post<RefreshTokenResponse>(`${this.baseUrl}/refresh`);

        localStorage.setItem('accessToken', data.meta.tokens.accessToken);
        localStorage.setItem('refreshToken', data.meta.tokens.refreshToken || '');

        api.defaults.headers.common = {
            Authorization: `Bearer ${data.meta.tokens.accessToken}`,
            'Refresh-Token': `${data.meta.tokens.refreshToken}`,
        };

        return data;
    }
}

export const authService = new AuthService();
