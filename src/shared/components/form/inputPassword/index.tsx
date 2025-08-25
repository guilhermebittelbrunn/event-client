import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { cn } from '@/shared/utils/cn';
import { Label } from '../label';

export type InputPasswordProps = AntdInputProps & {
    label?: string;
    required?: boolean;
};

export function InputPassword({
    className,
    label,
    required,
    id,
    placeholder,
    size = 'large',
    ...props
}: InputPasswordProps) {
    return (
        <>
            <Label required={required} htmlFor={id} className="text-matte-black dark:text-snow-white">
                {label}
            </Label>
            <AntdInput.Password
                id={id}
                size={size}
                placeholder={placeholder || label || undefined}
                className={cn(
                    'h-11 w-full rounded-lg border appearance-none border-gray-200 px-4 py-2.5 text-sm shadow-theme-xs bg-snow-white placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-matte-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
                    className,
                )}
                {...props}
                type="password"
            />
        </>
    );
}
