import React, { PropsWithChildren } from 'react';
import { Tooltip } from '../tooltip';
import { cn } from '@/shared/utils/helpers/cn';
import { ExclamationOutlined } from '@ant-design/icons';

export interface ErrorBadgeProps extends PropsWithChildren {
    message: string;
    children: React.ReactNode;
    hidden?: boolean;
    className?: string;
}

export function ErrorBadge({ children, message, hidden = false, className }: ErrorBadgeProps) {
    return (
        <div className="relative">
            <Tooltip
                trigger={['click', 'hover']}
                title={message}
                className={cn(`absolute top-[-10px] right-[-10px] z-9`, hidden && 'hidden', className)}
            >
                <div className="flex items-center justify-center w-6 h-6 bg-snow-white text-red-600 rounded-full border-1 border-red-600 dark:bg-matte-black dark:text-red-600 dark:border-red-600">
                    <ExclamationOutlined />
                </div>
            </Tooltip>

            {children}
        </div>
    );
}
