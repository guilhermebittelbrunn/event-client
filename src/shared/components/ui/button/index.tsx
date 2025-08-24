import { cn } from '@/shared/utils/cn';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { ButtonType } from 'antd/es/button';

export interface ButtonProps extends AntdButtonProps {
    children?: React.ReactNode;
    className?: string;
    size?: 'large' | 'middle' | 'small';
    type?: ButtonType;
}

export function Button({ children, className, size = 'middle', type = 'primary', ...props }: ButtonProps) {
    return (
        <AntdButton
            size={size}
            type={type}
            className={cn(
                type == 'primary'
                    ? 'py-4 flex items-center font-bold justify-center text-sm  text-white transition rounded-lg bg-brand-500 dark:bg-brand-900 shadow-theme-xs hover:bg-brand-600 dark:hover:bg-brand-600'
                    : 'py-4 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition text-sm bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
                className,
            )}
            {...props}
        >
            {children}
        </AntdButton>
    );
}
