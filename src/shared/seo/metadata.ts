import type { Metadata } from 'next';
import qinstanteLogo from '@/assets/images/shared/qinstante.png';

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
    const result = { ...target };
    for (const key of Object.keys(source) as (keyof T)[]) {
        const sourceVal = source[key];
        if (sourceVal !== undefined) {
            const targetVal = result[key];
            if (
                typeof sourceVal === 'object' &&
                sourceVal !== null &&
                !Array.isArray(sourceVal) &&
                typeof targetVal === 'object' &&
                targetVal !== null &&
                !Array.isArray(targetVal)
            ) {
                (result as Record<keyof T, unknown>)[key] = deepMerge(
                    targetVal as object,
                    sourceVal as object,
                ) as T[keyof T];
            } else {
                (result as Record<keyof T, unknown>)[key] = sourceVal as T[keyof T];
            }
        }
    }
    return result;
}

type MetadataGenerator = Omit<Metadata, 'description' | 'title'> & {
    title: string;
    description: string;
    image?: string;
    /** Caminho canônico relativo ao domínio (ex.: '/', '/cadastro'). Omitir quando não indexável. */
    path?: string;
    /** Marcar a página como noindex (ex.: páginas privadas/gated como /evento). */
    noindex?: boolean;
};

const applicationName = 'Qinstante';
const author: Metadata['authors'] = {
    name: 'Qinstante',
    url: 'https://qinstante.com.br/',
};
const publisher = 'Qinstante';
const twitterHandle = '@qinstante';
// Fallback fixo para o domínio de produção: garante metadataBase/canonical/OG
// absolutos mesmo se a env não estiver setada (senão OG/canonical viram relativos e quebram).
const rawBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || 'https://qinstante.com.br';
// Normaliza o protocolo: se a env vier sem http(s), `new URL()` lançaria e derrubaria a metadata.
const baseUrl = rawBaseUrl.startsWith('http') ? rawBaseUrl : `https://${rawBaseUrl}`;

const defaultKeywords = [
    'Qinstante',
    'fotos colaborativas',
    'álbum colaborativo',
    'fotos de casamento',
    'QR code para fotos',
    'compartilhar fotos de evento',
    'galeria de fotos ao vivo',
    'fotos de convidados',
];

export const createMetadata = ({
    title,
    description,
    image,
    path,
    noindex,
    ...properties
}: MetadataGenerator): Metadata => {
    // Evita duplicar a marca quando o título já a contém (ex.: home).
    const parsedTitle = title.includes(applicationName) ? title : `${title} | ${applicationName}`;
    const defaultMetadata: Metadata = {
        title: parsedTitle,
        description,
        applicationName,
        metadataBase: new URL(baseUrl),
        keywords: defaultKeywords,
        authors: [author],
        creator: author.name,
        alternates: path ? { canonical: path } : undefined,
        robots: noindex
            ? { index: false, follow: false }
            : { index: true, follow: true, googleBot: { index: true, follow: true } },
        formatDetection: {
            telephone: false,
        },
        appleWebApp: {
            capable: true,
            statusBarStyle: 'default',
            title: parsedTitle,
        },
        openGraph: {
            title: parsedTitle,
            description,
            type: 'website',
            siteName: applicationName,
            locale: 'pt_BR',
            url: path ?? '/',
            images: [
                {
                    url: qinstanteLogo.src,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        publisher,
        twitter: {
            card: 'summary_large_image',
            creator: twitterHandle,
            title: parsedTitle,
            description,
        },
    };

    const metadata: Metadata = deepMerge(defaultMetadata, properties);

    if (image && metadata.openGraph) {
        metadata.openGraph.images = [
            {
                url: image,
                width: 1200,
                height: 630,
                alt: title,
            },
        ];
    }

    return metadata;
};
