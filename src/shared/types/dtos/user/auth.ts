import { EventAccessTypeEnum } from '../event';

export interface TokenDTO {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    expiresAt: number;
}

export interface EventTokenDTO {
    accessToken: string;
    expiresIn: number;
    expiresAt: number;
}

export interface EventTokenPayload {
    sub: string;
    slug: string;
    type: EventAccessTypeEnum;
    iat: number;
    exp: number;
}

export interface UserTokenPayload {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
