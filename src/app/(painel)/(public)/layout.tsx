'use client';

import { Logo } from '@/shared/assets/icons';
import { Title } from '@/shared/components/ui';
import { Box } from '@/shared/components/ui/box';
import ThemeToggleButton from '@/shared/components/ui/themeToggleButton';
import { useSidebar } from '@/shared/context/SidebarContext';
import Link from 'next/link';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isMobile } = useSidebar();

    return (
        <Box type="secondary" className="relative p-6 sm:p-0">
            <Box
                type={isMobile ? 'secondary' : undefined}
                className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0"
            >
                {children}
                <Box className="lg:w-1/2 w-full h-full lg:grid items-center hidden">
                    <Box className="relative items-center justify-center flex z-1">
                        <Box className="flex flex-col items-center max-w-xs">
                            <Link href="/" className="block">
                                <Logo width={72} height={72} />
                            </Link>
                            <Title className="text-center text-gray-400 dark:text-white/60 font-nanum-brush text-2xl sm:text-3xl md:text-4xl">
                                Qinstante
                            </Title>
                        </Box>
                    </Box>
                </Box>
                <div className="fixed bottom-6 right-6 z-50">
                    <ThemeToggleButton type="secondary" />
                </div>
            </Box>
        </Box>
    );
}
