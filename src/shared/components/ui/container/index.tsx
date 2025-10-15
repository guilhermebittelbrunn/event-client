import { cn } from '@/shared/utils/helpers/cn';
import React from 'react';
import { Box } from '../box';

interface ContainerProps {
    title?: string;
    children: React.ReactNode;
    subTitle?: string | React.ReactNode;
    className?: string; // Additional custom classes for styling
    desc?: string; // Description text
}

export function Container({ title, children, subTitle, className = '', desc = '' }: ContainerProps) {
    return (
        <Box className={cn(`rounded-xl border border-none dark:bg-matte-black`, className)}>
            {/* Container Header */}
            {title && (
                <div className="px-6 py-5 flex flex-row justify-between rounded-2xl dark:bg-matte-black">
                    <div>
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
                        {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
                    </div>
                    {subTitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subTitle}</p>}
                </div>
            )}

            {/* Container Body */}
            <Box
                className={cn(
                    `p-4 rounded-xl border-gray-100 dark:border-matte-black-contrast sm:p-6 ${title && 'border-t'}`,
                    className,
                )}
            >
                <div className={cn('space-y-6', className)}>{children}</div>
            </Box>
        </Box>
    );
}
