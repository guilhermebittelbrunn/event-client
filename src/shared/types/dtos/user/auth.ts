export interface TokenDTO {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    expiresAt: number;
}

export interface UserTokenPayload {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
