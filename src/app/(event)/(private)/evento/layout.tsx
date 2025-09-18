'use client';

import { Box } from '@/shared/components/ui/box';
import { Title } from '@/shared/components/ui';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import ThemeToggleButton from '@/shared/components/ui/themeToggleButton';
import React from 'react';
import { EventProvider } from '@/shared/context/EventContext';

export default function EventLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <EventProvider>
                <div className="min-h-screen bg-snow-white dark:bg-matte-black flex flex-col">
                    <header className="sticky top-0 z-40 bg-snow-white dark:bg-matte-black border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between px-4 py-3">
                            <Title className="text-2xl font-bold text-matte-black dark:text-snow-white font-cursive">
                                Qinstante
                            </Title>
                            <ThemeToggleButton type="secondary" />
                        </div>
                    </header>

                    <main className="flex-1 overflow-hidden">
                        <Box className="h-full bg-gray-50 dark:bg-gray-900">{children}</Box>
                    </main>

                    {/* @TODO - create mobile navbar navigation after create other event pages */}
                    {/* <MobileNavbar /> */}

                    {/* <div className="h-16"></div> */}
                </div>
            </EventProvider>
        </ThemeProvider>
    );
}
