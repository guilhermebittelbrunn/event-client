import { DatePicker as AntdDatePicker, DatePickerProps as AntdDatePickerProps } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { FieldError } from 'react-hook-form';
import { ErrorBadge } from '../../ui';
import { Label } from '../label';

export interface DatePickerProps extends AntdDatePickerProps {
    error?: FieldError;
    showErrorBadge?: boolean;
    label?: string;
    required?: boolean;
    id?: string;
}

export function DatePicker({
    onChange,
    className,
    error,
    showErrorBadge = true,
    label,
    required,
    id,
    ...props
}: DatePickerProps) {
    return (
        <>
            {label && (
                <Label required={required} htmlFor={id} className="text-matte-black dark:text-snow-white">
                    {label}
                </Label>
            )}

            <ErrorBadge
                hidden={!error || !showErrorBadge}
                message={error?.message || 'Data inválida'}
                className="top-0"
            >
                <AntdDatePicker
                    onChange={onChange}
                    format="DD/MM/YYYY"
                    className={cn(
                        `h-11 w-full rounded-lg border appearance-none border-gray-200 px-4 py-2.5 text-md shadow-theme-xs bg-snow-white placeholder:text-gray-400 focus:outline-hidden focus:ring-3
                        dark:bg-matte-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800
                        dark:border-gray-700 `,
                        error && 'border-red-600 dark:border-red-900',
                        className,
                    )}
                    {...props}
                />
            </ErrorBadge>
        </>
    );
}
