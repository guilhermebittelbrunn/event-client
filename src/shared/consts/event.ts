import { EventStatusEnum } from '../types/dtos';

export const EVENT_REDIRECT_SECONDS = 20;

/**
 * @note for now, we don't have use for draft/published statuses
 */
export const EVENT_TYPES = {
    [EventStatusEnum.DRAFT]: 'Rascunho',
    [EventStatusEnum.PENDING_PAYMENT]: 'Aguardando pagamento',
    // [EventStatusEnum.PUBLISHED]: 'Publicado',
    [EventStatusEnum.IN_PROGRESS]: 'Em andamento',
    [EventStatusEnum.COMPLETED]: 'Concluído',
    [EventStatusEnum.CANCELLED]: 'Cancelado',
};

export const EVENT_STATUS_OPTIONS = Object.entries(EVENT_TYPES).map(([value, label]) => ({
    value,
    label,
}));
