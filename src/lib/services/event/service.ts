import {
    CreateEventRequest,
    CreateEventResponse,
    FindEventByIdResponse,
    FindEventBySlugResponse,
    UpdateEventRequest,
} from './types';
import { formDataFromObject } from '@/shared/utils/helpers/formDataHelper';
import { PaginatedResponse, PaginationRequestWithOrderAndDate, UpdateResponse } from '@/shared/types/utils';
import { EventDTO } from '@/shared/types/dtos';
import { AxiosInstance } from 'axios';

export default class EventService {
    private readonly baseUrl = '/event';

    constructor(private readonly client: AxiosInstance) {}

    async create(dto: CreateEventRequest): Promise<CreateEventResponse> {
        const body = formDataFromObject(dto);

        const { data } = await this.client.post<CreateEventResponse>(`${this.baseUrl}`, body, {
            headers: {
                'Content-Type': undefined, // Remove Content-Type to let the browser automatically set it for FormData
            },
        });

        return data;
    }

    async update(dto: UpdateEventRequest): Promise<UpdateResponse> {
        const body = formDataFromObject(dto);

        const { data } = await this.client.put<UpdateResponse>(`${this.baseUrl}/${dto.id}`, body, {
            headers: {
                'Content-Type': undefined, // Remove Content-Type to let the browser automatically set it for FormData
            },
        });

        return data;
    }

    async findById(id: string): Promise<FindEventByIdResponse> {
        const { data } = await this.client.get<FindEventByIdResponse>(`${this.baseUrl}/${id}`);
        return data;
    }

    async findBySlug(slug: string): Promise<FindEventBySlugResponse> {
        const { data } = await this.client.get<FindEventBySlugResponse>(`${this.baseUrl}/slug/${slug}`);
        return data;
    }

    async listPaginated(
        dto: PaginationRequestWithOrderAndDate<EventDTO>,
    ): Promise<PaginatedResponse<EventDTO>> {
        const { data } = await this.client.get<PaginatedResponse<EventDTO>>(`${this.baseUrl}`, { params: dto });

        return { data: data.data, meta: data.meta };
    }

    async delete(id: string): Promise<void> {
        await this.client.delete<void>(`${this.baseUrl}/${id}`);
    }
}
