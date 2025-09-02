import client from '@/lib/client';
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
import api from '@/shared/client/api';

export default class EventService {
    private readonly baseUrl = '/event';

    async signInByToken(token: string): Promise<SignInByTokenResponse> {
        const { data } = await api.post<SignInByTokenResponse>(`${this.baseUrl}/sign-in-by-token`, { token });

        api.defaults.headers.common = {
            'event-token': `${data.meta.token.accessToken}`,
        };

        return data;
    }

    async create(dto: CreateEventRequest): Promise<CreateEventResponse> {
        const body = formDataFromObject(dto);

        const { data } = await api.post<CreateEventResponse>(`${this.baseUrl}`, body, {
            headers: {
                'Content-Type': undefined, // Remove Content-Type to let the browser automatically set it for FormData
            },
        });

        return data;
    }

    async update(dto: UpdateEventRequest): Promise<UpdateResponse> {
        const body = formDataFromObject(dto);

        const { data } = await api.put<UpdateResponse>(`${this.baseUrl}/${dto.id}`, body, {
            headers: {
                'Content-Type': undefined, // Remove Content-Type to let the browser automatically set it for FormData
            },
        });

        return data;
    }

    async findById(id: string): Promise<FindEventByIdResponse> {
        const { data } = await api.get<FindEventByIdResponse>(`${this.baseUrl}/${id}`);
        return data;
    }

    async findBySlug(slug: string): Promise<FindEventBySlugResponse> {
        const { data } = await api.get<FindEventBySlugResponse>(`${this.baseUrl}/slug/${slug}`);
        return data;
    }

    async listPaginated(
        dto: PaginationRequestWithOrderAndDate<EventDTO>,
    ): Promise<PaginatedResponse<EventDTO>> {
        const { data } = await api.get<PaginatedResponse<EventDTO>>(`${this.baseUrl}`, { params: dto });

        return { data: data.data, meta: data.meta };
    }

    async delete(id: string): Promise<void> {
        await api.delete<void>(`${this.baseUrl}/${id}`);
    }
}

export const eventService = new EventService();
