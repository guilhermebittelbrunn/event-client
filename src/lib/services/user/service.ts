import { PaginatedResponse } from '@/shared/types/utils';
import { FindUserByIdResponse, ListPaginatedUserRequest } from './type';
import { AxiosInstance } from 'axios';
import { UserDTO } from '@/shared/types/dtos';

export default class UserService {
    private readonly baseUrl = '/user';

    constructor(private readonly client: AxiosInstance) {}

    async findById(id: string): Promise<FindUserByIdResponse> {
        const { data } = await this.client.get<FindUserByIdResponse>(`${this.baseUrl}/${id}`);

        return data;
    }

    async listPaginated(dto: ListPaginatedUserRequest): Promise<PaginatedResponse<UserDTO>> {
        const { data } = await this.client.get<PaginatedResponse<UserDTO>>(`${this.baseUrl}`, {
            params: dto,
        });

        return data;
    }
}
