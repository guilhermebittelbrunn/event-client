import client from '@/lib/client';
import ClientBase from '@/shared/client/base';
import { FindUserByIdResponse } from './type';

export default class UserService {
    private readonly baseUrl = '/user';

    constructor(private readonly client: ClientBase) {}

    async findById(id: string): Promise<FindUserByIdResponse> {
        const { data } = await this.client.request<FindUserByIdResponse>(this.client.restClient, {
            url: `${this.baseUrl}/${id}`,
            method: 'GET',
        });

        return data;
    }
}

export const userService = new UserService(client);
