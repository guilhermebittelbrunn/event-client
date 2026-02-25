import { BaseDTO } from '../../utils';

export interface PlanDTO extends BaseDTO {
    type: PlanTypeEnum;
    description?: string;
    price: number; // cents
    enabled: boolean;
    accessDays?: number | null;
}

export enum PlanTypeEnum {
    EVENT_BASIC = 'event_basic',
}

export enum PlanTypeFriendlyEnum {
    EVENT_BASIC = 'Evento - Básico',
}

export const PlanTypeOptions = [
    {
        value: PlanTypeEnum.EVENT_BASIC,
        label: PlanTypeFriendlyEnum.EVENT_BASIC,
    },
];
