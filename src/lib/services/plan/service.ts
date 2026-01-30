import { PaginatedResponse, PaginationRequest, UpdateResponse } from '@/shared/types/utils';
import { FindPlanByIdResponse, UpdatePlanRequest } from './types';
import { AxiosInstance } from 'axios';
import { PlanDTO } from '@/shared/types/dtos/billing/plan';

export default class PlanService {
    private readonly baseUrl = '/plan';

    constructor(private readonly client: AxiosInstance) {}

    async update(dto: UpdatePlanRequest): Promise<UpdateResponse> {
        const { data } = await this.client.put<UpdateResponse>(`${this.baseUrl}/${dto.id}`, dto);
        return data;
    }

    async findById(id: string): Promise<FindPlanByIdResponse> {
        const { data } = await this.client.get<FindPlanByIdResponse>(`${this.baseUrl}/${id}`);
        return data;
    }

    async listPaginated(dto: PaginationRequest): Promise<PaginatedResponse<PlanDTO>> {
        const { data } = await this.client.get<PaginatedResponse<PlanDTO>>(`${this.baseUrl}`, {
            params: dto,
        });

        return { data: data.data, meta: data.meta };
    }
}
