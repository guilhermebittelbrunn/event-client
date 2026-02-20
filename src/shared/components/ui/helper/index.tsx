import React, { PropsWithChildren } from 'react';
import { Tooltip } from '../tooltip';
import { cn } from '@/shared/utils/helpers/cn';
import { QuestionCircleOutlined } from '@ant-design/icons';

export interface HelperProps extends PropsWithChildren {
    message: string | React.ReactNode;
    hidden?: boolean;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    iconClassName?: string;
}

export function Helper({
    message,
    hidden = false,
    className,
    placement = 'bottom',
    iconClassName,
}: HelperProps) {
    return (
        <div className="relative">
            <Tooltip
                trigger={['click', 'hover']}
                title={message}
                className={cn(``, hidden && 'hidden', className)}
                placement={placement}
            >
                <QuestionCircleOutlined
                    className={cn(
                        'flex items-center justify-center bg-snow-white text-soft-gold rounded-full dark:bg-matte-black-contrast dark:text-soft-gold-dark scale-200',
                        iconClassName,
                    )}
                />
            </Tooltip>
        </div>
    );
}
