'use client';

import { Logo } from '@/shared/assets/icons';
import { Box } from '@/shared/components/ui/box';
import ThemeToggleButton from '@/shared/components/ui/themeToggleButton';
import { useSidebar } from '@/shared/context/SidebarContext';

import { ThemeProvider } from '@/shared/context/ThemeContext';
import Link from 'next/link';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isMobile } = useSidebar();

    return (
        <Box type="secondary" className="relative p-6 sm:p-0">
            <ThemeProvider>
                <Box
                    type={isMobile ? 'secondary' : undefined}
                    className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0"
                >
                    {children}
                    <Box className="lg:w-1/2 w-full h-full lg:grid items-center hidden">
                        <Box className="relative items-center justify-center flex z-1">
                            <Box className="flex flex-col items-center max-w-xs">
                                <Link href="/">
                                    <Logo width={48} height={48} />
                                </Link>
                                <p className="text-center text-gray-400 dark:text-white/60">Any description</p>
                            </Box>
                        </Box>
                    </Box>
                    <div className="fixed bottom-6 right-6 z-50">
                        <ThemeToggleButton type="secondary" />
                    </div>
                </Box>
            </ThemeProvider>
        </Box>
    );
}
