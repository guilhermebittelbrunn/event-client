import fs from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://qinstante.com.br';

/**
 * Configuração opcional por rota
 * Se não existir configuração, usamos default
 */
const routeConfig: Record<
    string,
    { priority?: number; changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'] }
> = {
    '': { priority: 1, changeFrequency: 'weekly' },
    entrar: { priority: 0.8, changeFrequency: 'monthly' },
    cadastro: { priority: 0.8, changeFrequency: 'monthly' },
    evento: { priority: 0.9, changeFrequency: 'monthly' },
};

/**
 * Descobre rotas automaticamente na pasta app (src/app ou app)
 */
function getAppRoutes(): string[] {
    const appDir = [path.join(process.cwd(), 'src', 'app'), path.join(process.cwd(), 'app')].find(dir => {
        try {
            return fs.existsSync(dir);
        } catch {
            return false;
        }
    });

    if (!appDir) return [];

    return fs
        .readdirSync(appDir, { withFileTypes: true })
        .filter(file => file.isDirectory())
        .filter(folder => !folder.name.startsWith('_')) // ignora privadas
        .filter(folder => !folder.name.startsWith('(')) // ignora route groups
        .map(folder => folder.name);
}

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = getAppRoutes();

    return [
        // homepage manual
        {
            url: BASE_URL,
            lastModified: new Date(),
            priority: routeConfig['']?.priority ?? 0.5,
            changeFrequency: routeConfig['']?.changeFrequency ?? 'monthly',
        },

        // rotas automáticas
        ...routes.map(route => {
            const config = routeConfig[route];

            return {
                url: `${BASE_URL}/${route}`,
                lastModified: new Date(),
                priority: config?.priority ?? 0.5,
                changeFrequency: config?.changeFrequency ?? 'monthly',
            };
        }),
    ];
}
