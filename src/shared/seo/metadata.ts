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
};

const applicationName = 'QInstante';
const author: Metadata['authors'] = {
    name: 'QInstante',
    url: 'https://qinstante.com.br/',
};
const publisher = 'QInstante';
const twitterHandle = '@qinstante';
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || (productionUrl ? `${protocol}://${productionUrl}` : undefined);

export const createMetadata = ({ title, description, image, ...properties }: MetadataGenerator): Metadata => {
    const parsedTitle = `${title} | ${applicationName}`;
    const defaultMetadata: Metadata = {
        title: parsedTitle,
        description,
        applicationName,
        metadataBase: baseUrl ? new URL(baseUrl) : undefined,
        authors: [author],
        creator: author.name,
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
