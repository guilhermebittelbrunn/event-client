import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    // Configuração para uploads grandes
    serverExternalPackages: [],

    // Configuração para aumentar limite de body size
    experimental: {
        // Aumentar limite de tamanho do body para uploads
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization, refresh-token, event-token',
                    },
                ],
            },
        ];
    },

    // Configuração do Turbopack (Next.js 16 usa Turbopack por padrão)
    // Resolver aviso sobre workspace root
    turbopack: {
        root: process.cwd(),
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },

    // Mantém webpack config para builds de produção (fallback)
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'event-mvp.s3.us-east-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'acapra.s3.us-east-1.amazonaws.com',
            },
        ],
    },
};

export default nextConfig;
