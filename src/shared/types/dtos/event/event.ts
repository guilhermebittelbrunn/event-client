import { BaseDTO } from '../../utils';
import { PaymentDTO } from '../billing/payment';
import { MemoryDTO } from '../memory';
import { FileDTO } from '../shared';
import { UserDTO } from '../user';
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

export enum EventStatusFriendlyEnum {
    DRAFT = 'Rascunho',
    PENDING_PAYMENT = 'Aguardando pagamento',
    PUBLISHED = 'Publicado',
    IN_PROGRESS = 'Em andamento',
    COMPLETED = 'Concluído',
    CANCELLED = 'Cancelado',
}

export const EventStatusOptions = [
    {
        value: EventStatusEnum.DRAFT,
        label: EventStatusFriendlyEnum.DRAFT,
    },
    {
        value: EventStatusEnum.PENDING_PAYMENT,
        label: EventStatusFriendlyEnum.PENDING_PAYMENT,
    },
    {
        value: EventStatusEnum.PUBLISHED,
        label: EventStatusFriendlyEnum.PUBLISHED,
    },
    {
        value: EventStatusEnum.IN_PROGRESS,
        label: EventStatusFriendlyEnum.IN_PROGRESS,
    },
    {
        value: EventStatusEnum.COMPLETED,
        label: EventStatusFriendlyEnum.COMPLETED,
    },
    {
        value: EventStatusEnum.CANCELLED,
        label: EventStatusFriendlyEnum.CANCELLED,
    },
];

export interface EventDTO extends BaseDTO {
    userId: string;
    fileId?: string | null;
    slug: string;
    status: EventStatusEnum;
    name: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    totalMemories: number;

    config?: EventConfigDTO;
    guestAccess?: EventAccessDTO;
    file?: FileDTO;
    user?: UserDTO;
    memories?: MemoryDTO[];
    payment?: PaymentDTO;
}
