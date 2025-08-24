import { Outfit } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/shared/context/ThemeContext';
import { Metadata } from 'next';
import { SidebarProvider } from '@/shared/context/SidebarContext';
import ClientLayout from './clientLayout';
import { AlertProvider } from '@/shared/context/AlertContext';

const outfit = Outfit({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Event-Client',
    description: 'Event-Client',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR">
            <body className={`${outfit.className} dark:bg-gray-900`}>
                <ThemeProvider>
                    <AlertProvider>
                        <SidebarProvider>
                            <ClientLayout>{children}</ClientLayout>
                        </SidebarProvider>
                    </AlertProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
