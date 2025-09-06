import { PaginatedResponse } from '@/shared/types/utils';
import {
    CreateMemoryRequest,
    CreateMemoryResponse,
    FindMemoryByIdResponse,
    ListPaginatedMemoryRequest,
    DownloadMemoriesRequest,
    DownloadMemoriesResponse,
} from './types';
import { formDataFromObject } from '@/shared/utils/helpers/formDataHelper';
import { AxiosInstance } from 'axios';
import { MemoryDTO } from '@/shared/types/dtos';

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

    async findById(id: string): Promise<FindMemoryByIdResponse> {
        const { data } = await this.client.get<FindMemoryByIdResponse>(`${this.baseUrl}/${id}`);
        return data;
    }

    async findByIdForGuest(id: string): Promise<FindMemoryByIdResponse> {
        const { data } = await this.client.get<FindMemoryByIdResponse>(`${this.baseUrl}/guest/${id}`);
        return data;
    }

    async listPaginated(dto: ListPaginatedMemoryRequest): Promise<PaginatedResponse<MemoryDTO>> {
        const { data } = await this.client.get<PaginatedResponse<MemoryDTO>>(`${this.baseUrl}`, {
            params: dto,
        });

        return { data: data.data, meta: data.meta };
    }

    async delete(id: string): Promise<void> {
        await this.client.delete<void>(`${this.baseUrl}/${id}`);
    }

    async deleteBulk(ids: string[]): Promise<void> {
        await this.client.post<void>(`${this.baseUrl}/delete-bulk`, { memoryIds: ids });
    }

    async download(dto: DownloadMemoriesRequest): Promise<DownloadMemoriesResponse> {
        const { data } = await this.client.post(`${this.baseUrl}/download`, dto, {
            responseType: 'blob',
        });
        return { data };
    }
}
