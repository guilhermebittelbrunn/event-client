import { EventDTO, EventStatusEnum } from '@/shared/types/dtos';
import { UpdateRequest } from '@/shared/types/utils';

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

export interface UpdateEventRequest extends UpdateRequest<CreateEventRequest> {
    id: string;
}
