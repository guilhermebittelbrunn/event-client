import client from '@/lib/client';
import ClientBase from '@/shared/client/base';
import {
    CreateEventRequest,
    CreateEventResponse,
    FindEventByIdResponse,
    FindEventBySlugResponse,
    SignInByTokenResponse,
    UpdateEventRequest,
} from './types';
import { formDataFromObject } from '@/shared/utils/helpers/formDataHelper';
import { PaginatedResponse, PaginationRequestWithOrderAndDate, UpdateResponse } from '@/shared/types/utils';
import { EventDTO } from '@/shared/types/dtos';

export default class EventService {
    private readonly baseUrl = '/event';

    constructor(private readonly client: ClientBase) {}

    async signInByToken(token: string): Promise<SignInByTokenResponse> {
        const { data } = await this.client.request<SignInByTokenResponse>(this.client.restClient, {
            url: `${this.baseUrl}/sign-in-by-token`,
            method: 'POST',
            data: { token },
        });

        localStorage.setItem('eventToken', data.meta.token.accessToken || '');

        this.client.setHeaders({
            'event-token': `${data.meta.token.accessToken}`,
        });

        return data;
    }

    async create(dto: CreateEventRequest): Promise<CreateEventResponse> {
        const body = formDataFromObject(dto);

        const { data } = await this.client.request<CreateEventResponse>(this.client.restClient, {
            url: `${this.baseUrl}`,
            method: 'POST',
            data: body,
            headers: {
                'Content-Type': undefined, // Remove Content-Type to let the browser automatically set it for FormData
            },
        });

        return data;
    }

    async update(dto: UpdateEventRequest): Promise<UpdateResponse> {
        const body = formDataFromObject(dto);

        const { data } = await this.client.request<UpdateResponse>(this.client.restClient, {
            url: `${this.baseUrl}/${dto.id}`,
            method: 'PUT',
            data: body,
            headers: {
                'Content-Type': undefined, // Remove Content-Type to let the browser automatically set it for FormData
            },
        });

        return data;
    }

    async findById(id: string): Promise<FindEventByIdResponse> {
        const { data } = await this.client.request<FindEventByIdResponse>(this.client.restClient, {
            url: `${this.baseUrl}/${id}`,
            method: 'GET',
        });
        return data;
    }

    async findBySlug(slug: string): Promise<FindEventBySlugResponse> {
        const { data } = await this.client.request<FindEventByIdResponse>(this.client.restClient, {
            url: `${this.baseUrl}/slug/${slug}`,
            method: 'GET',
        });
        return data;
    }

    async listPaginated(
        dto: PaginationRequestWithOrderAndDate<EventDTO>,
    ): Promise<PaginatedResponse<EventDTO>> {
        const { data } = await this.client.request<PaginatedResponse<EventDTO>>(this.client.restClient, {
            url: `${this.baseUrl}`,
            method: 'GET',
            params: dto,
        });

        return { data: data.data, meta: data.meta };
    }

    async delete(id: string): Promise<void> {
        await this.client.request<void>(this.client.restClient, {
            url: `${this.baseUrl}/${id}`,
            method: 'DELETE',
        });
    }
}

export const eventService = new EventService(client);
