import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { cn } from '@/shared/utils/cn';
import { Label } from '../label';

export type InputProps = AntdInputProps & {
    label?: string;
    required?: boolean;
};

export function Input({ className, label, required, id, placeholder, size = 'large', ...props }: InputProps) {
    return (
        <>
            <Label required={required} htmlFor={id}>
                {label}
            </Label>
            <AntdInput
                id={id}
                size={size}
                placeholder={placeholder || label || undefined}
                className={cn(
                    'h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
                    className,
                )}
                {...props}
            />
        </>
    );
}
