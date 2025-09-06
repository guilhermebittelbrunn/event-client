import { CreateMemoryRequest, CreateMemoryResponse } from './types';
import { formDataFromObject } from '@/shared/utils/helpers/formDataHelper';
import { AxiosInstance } from 'axios';

export default class MemoryService {
    private readonly baseUrl = '/memory';

    constructor(private readonly client: AxiosInstance) {}

    async create(dto: CreateMemoryRequest): Promise<CreateMemoryResponse> {
        const body = formDataFromObject(dto);

        const { data } = await this.client.post<CreateMemoryResponse>(`${this.baseUrl}`, body, {
            headers: {
                'Content-Type': undefined, // Remove Content-Type to let the browser automatically set it for FormData
            },
        });

        return data;
    }
}
