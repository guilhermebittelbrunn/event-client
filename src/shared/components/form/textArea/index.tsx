import { Input } from 'antd';
import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input';
import { cn } from '@/shared/utils/helpers/cn';
import { FieldError } from 'react-hook-form';
import { Label } from '../label';
import { ErrorBadge } from '../../ui';
import { useRef, useState, useEffect } from 'react';

const { TextArea: AntdTextArea } = Input;

export interface TextAreaProps extends AntdTextAreaProps {
    error?: FieldError;
    label?: string;
    required?: boolean;
    labelClassName?: string;
    showErrorBadge?: boolean;
    maxLength?: number;
}

export function TextArea({
    className,
    label,
    required,
    labelClassName,
    showErrorBadge = true,
    error,
    maxLength,
    value,
    defaultValue,
    ...props
}: TextAreaProps) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        const currentValue = value ?? ref.current?.value ?? defaultValue ?? '';
        setCharCount(String(currentValue).length);
    }, [value, defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let newValue = e.target.value;

        if (maxLength && newValue.length > maxLength) {
            newValue = newValue.slice(0, maxLength);

            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: newValue,
                },
            };
            e = syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>;
        }

        setCharCount(newValue.length);
        props.onChange?.(e);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                {label ? (
                    <Label
                        required={required}
                        className={cn('text-matte-black dark:text-snow-white', labelClassName)}
                    >
                        {label}
                    </Label>
                ) : (
                    <span />
                )}
                {maxLength && (
                    <p className="text-matte-black dark:text-snow-white opacity-75 text-sm">
                        {charCount}/{maxLength}
                    </p>
                )}
            </div>
            <ErrorBadge hidden={!error || !showErrorBadge} message={error?.message || 'Campo inválido'}>
                <AntdTextArea
                    ref={ref}
                    size="large"
                    className={cn(
                        `h-11 w-full rounded-lg border appearance-none border-gray-200 px-4 py-2.5 shadow-theme-xs bg-snow-white placeholder:text-gray-400 focus:outline-hidden focus:ring-3
                        dark:bg-matte-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800
                        dark:border-gray-700 `,
                        error && 'border-red-600 dark:border-red-900',
                        className,
                    )}
                    {...props}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                />
            </ErrorBadge>
        </div>
    );
}
