export interface TokenDTO {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    expires_at: number;
}
