import { EventDTO, EventStatusEnum } from '@/shared/types/dtos';
import { EventTokenDTO } from '@/shared/types/dtos/user/auth';
import { PaginationRequestWithOrderAndDate, UpdateRequest } from '@/shared/types/utils';

export interface CreateEventRequest {
    name: string;
    slug: string;
    status?: EventStatusEnum;
    description?: string;
    startAt: Date;
    endAt: Date;
    image?: File;
}

export interface CreateEventResponse {
    data: EventDTO;
}

export interface FindEventByIdResponse {
    data: EventDTO;
}
export interface FindEventBySlugResponse {
    data: EventDTO;
}

export interface ListPaginatedEventRequest extends PaginationRequestWithOrderAndDate<EventDTO> {
    statuses?: EventStatusEnum[];
}
export interface UpdateEventRequest extends UpdateRequest<CreateEventRequest> {
    id: string;
}

export interface SignInByTokenRequest {
    token: string;
}

export interface SignInByTokenResponse {
    data: EventDTO;
    meta: {
        token: EventTokenDTO;
    };
}
