import type { MetadataRoute } from 'next';

/**
 * Web App Manifest (PWA). Melhora sinais de mobile/instalação e a aparência
 * quando o app é adicionado à tela inicial. Servido em /manifest.webmanifest.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Qinstante — Fotos colaborativas para casamentos e eventos',
        short_name: 'Qinstante',
        description:
            'Seus convidados registram e compartilham fotos do evento em tempo real, por um QR code. Um álbum colaborativo do casamento ou festa.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FAFAFA',
        theme_color: '#CBA135',
        lang: 'pt-BR',
        categories: ['photo', 'social', 'lifestyle'],
        icons: [
            {
                src: '/images/shared/qinstante.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
