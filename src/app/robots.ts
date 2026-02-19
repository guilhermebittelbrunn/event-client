import type { MetadataRoute } from 'next';

const url = process.env.NEXT_PUBLIC_APP_URL || 'qinstante.com.br';

const protocol = url?.startsWith('https') ? 'https' : 'http';
const baseUrl = url || `${protocol}://${url}`;

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: new URL('/sitemap.xml', baseUrl).href,
    };
}
