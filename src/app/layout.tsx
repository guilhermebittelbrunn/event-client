'use client';

import { Outfit } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/shared/context/ThemeContext';
import { SidebarProvider } from '@/shared/context/SidebarContext';
import ClientLayout from './clientLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ToastContainer } from 'react-toastify';

const outfit = Outfit({
    subsets: ['latin'],
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
        <html lang="pt-BR">
            <body className={`${outfit.className} dark:bg-gray-900`}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <SidebarProvider>
                            <ClientLayout>{children}</ClientLayout>
                            <ToastContainer className="scale-90 md:scale-100" />
                        </SidebarProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
