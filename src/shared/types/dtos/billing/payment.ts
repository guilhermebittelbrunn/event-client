import { BaseDTO } from '../../utils';

export interface PaymentDTO extends BaseDTO {
    status: PaymentStatusEnum;
    amount: number;
    currency: string;
    paymentUrl: string;
}

export enum PaymentStatusEnum {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
}
