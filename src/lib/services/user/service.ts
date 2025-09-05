import { FindUserByIdResponse } from './type';
import { AxiosInstance } from 'axios';

export default class UserService {
    private readonly baseUrl = '/user';

    constructor(private readonly client: AxiosInstance) {}

    async findById(id: string): Promise<FindUserByIdResponse> {
        const { data } = await this.client.get<FindUserByIdResponse>(`${this.baseUrl}/${id}`);

        return data;
    }
}
