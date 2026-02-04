'use client';

import { Outfit, Nanum_Brush_Script, Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/shared/context/SidebarContext';
import ClientLayout from './clientLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/next';

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: false,
                    },
                },
            }),
        [],
    );

    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body
                className={`${outfit.className} ${nanumBrushScript.variable} ${playfairDisplay.variable} ${montserrat.variable} bg-white`}
            >
                <QueryClientProvider client={queryClient}>
                    <SidebarProvider>
                        <ClientLayout>{children}</ClientLayout>
                        <ToastContainer className="scale-90 md:scale-100" />
                    </SidebarProvider>
                </QueryClientProvider>
                <Analytics />
            </body>
        </html>
    );
}
