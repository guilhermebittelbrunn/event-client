import type { MetadataRoute } from 'next';

const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 'qinstante.com.br';
const baseUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl}`;

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Áreas privadas/utilitárias: fora do índice e do orçamento de rastreamento.
            // /evento/* NÃO é bloqueado aqui (para o preview OG ao compartilhar o link
            // funcionar); a indexação é barrada via `noindex` no metadata da rota.
            disallow: ['/painel', '/api'],
        },
        sitemap: new URL('/sitemap.xml', baseUrl).href,
        host: baseUrl,
    };
}
