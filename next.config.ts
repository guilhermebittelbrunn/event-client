import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
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
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: 'http://localhost:4000/v1/:path*',
            },
        ];
    },
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
                hostname: 'acapra.s3.us-east-1.amazonaws.com',
            },
        ],
    },
};

export default nextConfig;
