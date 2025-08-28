import client from '@/lib/client';
import { UserDTO } from '@/shared/types/dtos';
import { SignInRequest, SignInResponse, SignUpRequest } from './types';
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

        this.client.setHeaders({
            Authorization: data.data.tokens.access_token,
            'Refresh-Token': data.data.tokens.refresh_token ?? '',
        });

        return data;
    }

    async getUser() {
        const { data } = await this.client.request<UserDTO>(this.client.restClient, {
            url: `${this.baseUrl}/me`,
            method: 'GET',
        });

        return data;
    }
}

export const authService = new AuthService(client);
