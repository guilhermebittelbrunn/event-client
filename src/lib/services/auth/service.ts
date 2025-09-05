import { UserDTO } from '@/shared/types/dtos';
import { RefreshTokenResponse, SignInRequest, SignInResponse, SignUpRequest } from './types';
import api from '@/shared/client/api';
import { SignInByTokenResponse } from '../event';
import { AxiosInstance } from 'axios';

export default class AuthService {
    private readonly baseUrl = '/auth';

    constructor(private readonly client: AxiosInstance) {}

    async signUp(dto: SignUpRequest): Promise<UserDTO> {
        const { data } = await this.client.post<UserDTO>(`${this.baseUrl}/sign-up`, dto);

        return data;
    }

    async signIn(dto: SignInRequest): Promise<SignInResponse> {
        const { data } = await this.client.post<SignInResponse>(`${this.baseUrl}/sign-in`, dto);

        this.client.defaults.headers.common = {
            Authorization: `Bearer ${data.meta.tokens.accessToken}`,
            'refresh-token': `${data.meta.tokens.refreshToken}`,
        };

        return data;
    }

    async signInByToken(token: string): Promise<SignInByTokenResponse> {
        const { data } = await this.client.post<SignInByTokenResponse>(`${this.baseUrl}/sign-in-by-token`, {
            token,
        });

        api.defaults.headers.common = {
            'event-token': `${data.meta.token.accessToken}`,
        };

        return data;
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        const { data } = await this.client.post<RefreshTokenResponse>(`${this.baseUrl}/refresh`);

        this.client.defaults.headers.common = {
            Authorization: `Bearer ${data.meta.tokens.accessToken}`,
            'Refresh-Token': `${data.meta.tokens.refreshToken}`,
        };

        return data;
    }
}
