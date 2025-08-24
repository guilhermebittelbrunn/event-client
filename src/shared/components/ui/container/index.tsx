import { cn } from '@/shared/utils/cn';
import React from 'react';

interface ContainerProps {
    title?: string;
    children: React.ReactNode;
    subTitle?: string | React.ReactNode;
    className?: string; // Additional custom classes for styling
    desc?: string; // Description text
}

export function Container({ title, children, subTitle, className = '', desc = '' }: ContainerProps) {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
        >
            {/* Container Header */}
            {title && (
                <div className="px-6 py-5 flex flex-row justify-between">
                    <div>
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
                        {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
                    </div>
                    {subTitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subTitle}</p>}
                </div>
            )}

            {/* Container Body */}
            <div
                className={cn(
                    `p-4 border-gray-100 dark:border-gray-800 sm:p-6 ${title && 'border-t'}`,
                    className,
                )}
            >
                <div className={cn('space-y-6', className)}>{children}</div>
            </div>
        </div>
    );
}
