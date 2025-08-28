import { DatePicker as AntdDatePicker, DatePickerProps as AntdDatePickerProps } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { FieldError } from 'react-hook-form';
import { ErrorBadge } from '../../ui';

export interface DatePickerProps extends AntdDatePickerProps {
    error?: FieldError;
    showErrorBadge?: boolean;
}

export function DatePicker({ onChange, className, error, showErrorBadge = true, ...props }: DatePickerProps) {
    return (
        <ErrorBadge
            hidden={!error || !showErrorBadge}
            message={error?.message || 'Data inválida'}
            className="top-0"
        >
            <AntdDatePicker
                onChange={onChange}
                className={cn(
                    `h-11 w-full rounded-lg border appearance-none border-gray-200 bg-snow-white placeholder:text-gray-400 focus:outline-hidden focus:ring-3
                    dark:bg-matte-black dark:text-white/90 dark:placeholder:text-white/30 px-4 py-2.5 text-sm shadow-theme-xs
                    dark:border-gray-700   dark:focus:border-black`,
                    error && 'border-red-600 dark:border-red-900',
                    className,
                )}
                {...props}
            />
        </ErrorBadge>
    );
}
