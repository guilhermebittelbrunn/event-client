import { DatePicker as AntdDatePicker } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { FieldError } from 'react-hook-form';
import { ErrorBadge } from '../../ui';
import { Label } from '../label';

const AntdRangePicker = AntdDatePicker.RangePicker;

export interface RangePickerProps {
    error?: FieldError;
    showErrorBadge?: boolean;
    className?: string;
    required?: boolean;
    label?: string;
    id?: string;
}

export function RangePicker({
    className,
    error,
    showErrorBadge = true,
    required,
    label,
    id,
    ...props
}: RangePickerProps) {
    return (
        <ErrorBadge
            hidden={!error || !showErrorBadge}
            message={error?.message || 'Data inválida'}
            className="top-[16px]"
        >
            <Label required={required} htmlFor={id} className="text-matte-black dark:text-snow-white">
                {label || 'Data de início/término'}
            </Label>
            <AntdRangePicker
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
