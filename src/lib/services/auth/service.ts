import client from '@/lib/client';
import { UserDTO } from '@/shared/types/dtos';
import { RefreshTokenResponse, SignInRequest, SignInResponse, SignUpRequest } from './types';
import ClientBase from '@/shared/client/base';

export default class AuthService {
    private readonly baseUrl = '/auth';

    constructor(private readonly client: ClientBase) {}

    async signUp(dto: SignUpRequest): Promise<UserDTO> {
        const { data } = await this.client.request<UserDTO>(this.client.restClient, {
            url: `${this.baseUrl}/sign-up`,
            method: 'POST',
            data: dto,
        });

        return data;
    }

    async signIn(dto: SignInRequest): Promise<SignInResponse> {
        const { data } = await this.client.request<SignInResponse>(this.client.restClient, {
            url: `${this.baseUrl}/sign-in`,
            method: 'POST',
            data: dto,
        });

        localStorage.setItem('accessToken', data.meta.tokens.accessToken);
        localStorage.setItem('refreshToken', data.meta.tokens.refreshToken || '');

        this.client.setHeaders({
            Authorization: `Bearer ${data.meta.tokens.accessToken}`,
            'Refresh-Token': `${data.meta.tokens.refreshToken}`,
        });

        return data;
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        const { data } = await this.client.request<RefreshTokenResponse>(this.client.restClient, {
            url: `${this.baseUrl}/refresh`,
            method: 'POST',
        });

        localStorage.setItem('accessToken', data.meta.tokens.accessToken);
        localStorage.setItem('refreshToken', data.meta.tokens.refreshToken || '');

        this.client.setHeaders({
            Authorization: `Bearer ${data.meta.tokens.accessToken}`,
            'Refresh-Token': `${data.meta.tokens.refreshToken}`,
        });

        return data;
    }
}

export const authService = new AuthService(client);
