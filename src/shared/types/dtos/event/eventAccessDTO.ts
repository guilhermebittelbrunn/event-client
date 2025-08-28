import { BaseDTO } from '../../utils';

export enum EventAccessTypeEnum {
    GUEST = 'guest',
    OWNER = 'owner',
}

export interface EventAccessDTO extends BaseDTO {
    eventId: string;

    url: string;

    type: EventAccessTypeEnum;
}
