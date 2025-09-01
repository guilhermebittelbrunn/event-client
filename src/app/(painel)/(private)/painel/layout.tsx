'use client';

import { Box } from '@/shared/components/ui/box';
import { useSidebar } from '@/shared/context/SidebarContext';
import AppHeader from '@/shared/layout/AppHeader';
import AppSidebar from '@/shared/layout/AppSidebar';
import Backdrop from '@/shared/layout/Backdrop';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
        ? 'ml-0'
        : isExpanded || isHovered
          ? 'lg:ml-[290px]'
          : 'lg:ml-[90px]';

    return (
        <div className="min-h-screen xl:flex bg-snow-white dark:bg-matte-black-contrast">
            <AppSidebar />
            <Backdrop />
            <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin} `}>
                <AppHeader />
                <Box className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 bg-white dark:bg-matte-black-contrast">
                    {children}
                </Box>
            </div>
        </div>
    );
}
