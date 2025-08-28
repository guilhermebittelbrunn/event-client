import { EventDTO, EventStatusEnum } from '@/shared/types/dtos';

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
