import type { Viewport } from 'next';
import { Outfit, Nanum_Brush_Script, Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/shared/context/SidebarContext';
import ClientLayout from './clientLayout';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/next';
import { QueryProvider } from '@/shared/context/QueryContext';
import { createMetadata } from '@/shared/seo/metadata';
import JsonLd from '@/shared/seo/JsonLd';
import { organizationSchema, websiteSchema } from '@/shared/seo/structuredData';
import qinstanteLogo from '@/assets/images/shared/qinstante.png';

const outfit = Outfit({
    subsets: ['latin'],
});

const nanumBrushScript = Nanum_Brush_Script({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-nanum-brush-script',
    display: 'swap',
});

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair-display',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
});

export const metadata = createMetadata({
    title: 'QInstante',
    description: 'QInstante - Transforme seu evento em uma experiência ao vivo',
    image: qinstanteLogo.src,
    icons: {
        icon: '/images/shared/qinstante.png',
        apple: '/images/shared/qinstante.png',
    },
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
        { media: '(prefers-color-scheme: dark)', color: '#1C1B19' },
    ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body
                className={`${outfit.className} ${nanumBrushScript.variable} ${playfairDisplay.variable} ${montserrat.variable} bg-white`}
            >
                <JsonLd data={[organizationSchema, websiteSchema]} />
                <QueryProvider>
                    <SidebarProvider>
                        <ClientLayout>{children}</ClientLayout>
                        <ToastContainer className="scale-90 md:scale-100" />
                    </SidebarProvider>
                </QueryProvider>
                <Analytics />
            </body>
        </html>
    );
}
