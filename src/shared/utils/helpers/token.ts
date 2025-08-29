export function getTokenPayload<T = any>(token?: string | null): T | null {
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export function isTokenExpired(token?: string | null): boolean {
    if (!token) return true;

    try {
        const payload = getTokenPayload(token);
        if (!payload || !payload.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - currentTime;

        return timeUntilExpiry < 300; // 5 minutes
    } catch {
        return true;
    }
}

export function shouldRefreshToken(token?: string | null): boolean {
    return isTokenExpired(token);
}
