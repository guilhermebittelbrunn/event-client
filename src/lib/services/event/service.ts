import {
    CreateEventRequest,
    CreateEventResponse,
    FindEventByIdResponse,
    ListPaginatedEventRequest,
    UpdateEventRequest,
} from './types';
import { formDataFromObject } from '@/shared/utils/helpers/formDataHelper';
import { PaginatedResponse, UpdateResponse } from '@/shared/types/utils';
import { EventDTO } from '@/shared/types/dtos';
import { AxiosInstance } from 'axios';
import { BaseService } from '@/lib/baseService';

export default class EventService extends BaseService {
    private readonly baseUrl = '/event';

    constructor(private readonly client: AxiosInstance) {
        super();
    }

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

    async findByIdForGuest(id: string): Promise<FindEventByIdResponse> {
        const { data } = await this.client.get<FindEventByIdResponse>(`${this.baseUrl}/guest/${id}`);
        return data;
    }

    async findBySlug(slug: string): Promise<EventDTO> {
        const { data } = await this.client.get<{ data: EventDTO }>(`${this.baseUrl}/slug/${slug}`);
        return data.data;
    }

    async listPaginated(dto: ListPaginatedEventRequest): Promise<PaginatedResponse<EventDTO>> {
        const { data } = await this.client.get<PaginatedResponse<EventDTO>>(
            `${this.baseUrl}?${this.buildQueryProperties(dto)}`,
        );

        return { data: data.data, meta: data.meta };
    }

    async delete(id: string): Promise<void> {
        await this.client.delete<void>(`${this.baseUrl}/${id}`);
    }
}
