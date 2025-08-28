import { BaseDTO } from '../../utils';
import { FileDTO } from '../shared';
import { EventAccessDTO } from './eventAccessDTO';
import { EventConfigDTO } from './eventConfig';

export enum EventStatusEnum {
    DRAFT = 'draft',
    PENDING_PAYMENT = 'pending_payment',
    PUBLISHED = 'published',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export interface EventDTO extends BaseDTO {
    userId: string;

    fileId?: string | null;

    slug: string;

    status: EventStatusEnum;

    name: string;

    description?: string;

    startAt: Date;

    endAt: Date;

    config?: EventConfigDTO;

    guestAccess?: EventAccessDTO;

    file?: FileDTO;
}
