import api from '@/shared/client/api';
import { FindUserByIdResponse } from './type';

export default class UserService {
    private readonly baseUrl = '/user';

    constructor() {}

    async findById(id: string): Promise<FindUserByIdResponse> {
        const headers = api.defaults.headers;

        console.log('headers :>> ', headers);

        const { data } = await api.get<FindUserByIdResponse>(`${this.baseUrl}/${id}`);

        console.log('data :>> ', data);

        return data;
    }
}

export const userService = new UserService();
