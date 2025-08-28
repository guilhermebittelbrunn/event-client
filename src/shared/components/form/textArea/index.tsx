import { Input } from 'antd';
import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input';
import { cn } from '@/shared/utils/helpers/cn';
import { FieldError } from 'react-hook-form';
import { Label } from '../label';
import { ErrorBadge } from '../../ui';

const { TextArea: AntdTextArea } = Input;

export interface TextAreaProps extends AntdTextAreaProps {
    error?: FieldError;
    label?: string;
    required?: boolean;
    showErrorBadge?: boolean;
}

export function TextArea({
    className,
    label,
    required,
    showErrorBadge = true,
    error,
    ...props
}: TextAreaProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label required={required} className="text-matte-black dark:text-snow-white">
                {label}
            </Label>
            <ErrorBadge hidden={!error || !showErrorBadge} message={error?.message || 'Campo inválido'}>
                <AntdTextArea
                    size="large"
                    className={cn(
                        `h-11 w-full rounded-lg border appearance-none border-gray-200 px-4 py-2.5 text-sm shadow-theme-xs bg-snow-white placeholder:text-gray-400 focus:outline-hidden focus:ring-3
                        dark:bg-matte-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800
                        dark:border-gray-700 `,
                        error && 'border-red-600 dark:border-red-900',
                        className,
                    )}
                    {...props}
                />
            </ErrorBadge>
        </div>
    );
}
