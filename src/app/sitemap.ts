import type { MetadataRoute } from 'next';

const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qinstante.com.br';
const BASE_URL = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

/**
 * Sitemap com as páginas PÚBLICAS e indexáveis.
 *
 * Só entram aqui URLs que queremos no índice do Google. Páginas privadas
 * (`/painel/*`), utilitárias (`/api/*`) e de evento (`/evento/[slug]`, que são
 * gated por token e marcadas `noindex`) ficam de fora de propósito.
 */
type Entry = {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

const publicPages: Entry[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/entrar', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/cadastro', priority: 0.8, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return publicPages.map(({ path, priority, changeFrequency }) => ({
        url: new URL(path, BASE_URL).href,
        lastModified,
        priority,
        changeFrequency,
    }));
}
