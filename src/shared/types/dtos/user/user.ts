import { BaseDTO } from '@/shared/types/utils';

export enum UserTypeEnum {
    ADMIN = 'admin',
    COMMON = 'common',
}

export interface UserDTO extends BaseDTO {
    name: string;
    email: string;
    type: UserTypeEnum;
}
