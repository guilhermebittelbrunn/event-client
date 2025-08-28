import { cn } from '@/shared/utils/helpers/cn';
import { Tooltip as AntdTooltip, TooltipProps as AntdTooltipProps } from 'antd';

export interface TooltipProps extends Omit<AntdTooltipProps, 'type'> {
    children?: React.ReactNode;
    className?: string;
}

export function Tooltip({ children, className, ...props }: TooltipProps) {
    return (
        <AntdTooltip {...props} className={cn(``, className)}>
            {children}
        </AntdTooltip>
    );
}
