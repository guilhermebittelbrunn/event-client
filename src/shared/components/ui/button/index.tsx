import { cn } from '@/shared/utils/helpers/cn';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';

export interface ButtonProps extends Omit<AntdButtonProps, 'type'> {
    children?: React.ReactNode;
    className?: string;
    size?: 'large' | 'middle' | 'small';
    type?: 'primary' | 'secondary';
    href?: string;
    loading?: boolean;
}

const buttonStyles = {
    primary:
        'p-4 flex items-center font-bold justify-center text-sm text-snow-white transition rounded-lg bg-soft-gold border-soft-gold border-1 shadow-theme-xs hover:opacity-80 dark:bg-soft-gold-dark',
    secondary:
        'p-4 flex items-center font-bold justify-center text-sm text-soft-gold transition rounded-lg bg-champagne border-soft-gold border-1 dark:text-snow-white shadow-theme-xs hover:opacity-70 dark:hover:opacity-80 dark:border-champagne-dark dark:bg-matte-black dark:text-soft-gold-dark dark:border-soft-gold-dark',
};

export function Button({ children, className, size = 'middle', type, loading, ...props }: ButtonProps) {
    return (
        <AntdButton
            size={size}
            className={cn(type ? buttonStyles[type] : '', loading && 'opacity-50', className)}
            loading={loading}
            {...props}
        >
            {children}
        </AntdButton>
    );
}
