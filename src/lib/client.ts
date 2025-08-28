import { Client } from '@/shared/client';

const client = new Client({
    environment:
        (process.env.NEXT_PUBLIC_REACT_APP_ENV as any) ||
        (process.env.APP_ENV as any) ||
        (process.env.VERCEL_ENV as any) ||
        'development',
    tokenStorageKey: '',
});

export default client;
