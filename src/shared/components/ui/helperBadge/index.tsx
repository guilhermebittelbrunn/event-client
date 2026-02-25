import React, { PropsWithChildren } from 'react';
import { cn } from '@/shared/utils/helpers/cn';
import { Helper } from '../helper';

export interface HelperBadgeProps extends PropsWithChildren {
    message: string | React.ReactNode;
    children: React.ReactNode;
    hidden?: boolean;
    className?: string;
}

export function HelperBadge({ children, message, hidden = false, className }: HelperBadgeProps) {
    return (
        <div className="relative">
            <Helper
                message={message}
                className={cn(`absolute top-[20px] right-[-6px] z-3`, hidden && 'hidden', className)}
                iconClassName="scale-150"
            />

            {children}
        </div>
    );
}
