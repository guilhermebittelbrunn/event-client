'use client';

import { Box } from '@/shared/components/ui/box';
import { Title } from '@/shared/components/ui';
import ThemeToggleButton from '@/shared/components/ui/themeToggleButton';
import React from 'react';
import useEvent, { EventProvider } from '@/shared/context/EventContext';
import MobileNavbar from './[slug]/(components)/mobileNavbar';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/utils';

function Page({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isFinished } = useEvent();

    return (
        <Box type="secondary" className="flex flex-col ">
            <header className="sticky top-0 z-40 bg-snow-white dark:bg-matte-black border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-3">
                    <Title
                        className="text-2xl font-bold text-matte-black dark:text-snow-white font-nanum-brush"
                        onClick={() => router.push('/')}
                    >
                        Qinstante
                    </Title>
                    <ThemeToggleButton type="secondary" />
                </div>
            </header>

            <main>
                <Box
                    type="secondary"
                    className={cn(
                        'min-h-[calc(100vh-150px)] flex flex-col touch-manipulation',
                        isFinished && 'min-h-auto',
                    )}
                >
                    {children}
                </Box>
            </main>

            {!isFinished && <MobileNavbar />}
        </Box>
    );
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
    return (
        <EventProvider>
            <Page>{children}</Page>
        </EventProvider>
    );
}
