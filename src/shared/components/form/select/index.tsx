import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Label } from '../label';
import { useMemo } from 'react';
import { DefaultOptionType } from 'antd/es/select';

export type ISelectOption = DefaultOptionType;

export interface SelectProps extends Omit<AntdSelectProps, 'mode'> {
    options: ISelectOption[];
    name?: string;
    changeUrl?: boolean;
    paramKey?: string;
    label?: string;
    required?: boolean;
    id?: string;
    placeholder?: string;
    multiple?: boolean;
}

export function Select({
    options,
    className,
    paramKey,
    changeUrl = false,
    onChange,
    label,
    required,
    placeholder,
    size = 'large',
    multiple = false,
    ...props
}: SelectProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentValue = useMemo(() => {
        const paramValue = paramKey ? searchParams.get(paramKey) : undefined;

        if (!paramValue) {
            return undefined;
        }

        if (multiple) {
            const values = paramValue.split(',');
            return values.filter(value => options?.find(option => option.value === value));
        }

        if (options?.find(option => option.value === paramValue)) {
            return paramValue;
        }

        return paramValue;
    }, [paramKey, multiple, searchParams, options]);

    const handleFilterChange = (key: string, value: string | string[] | null) => {
        const params = new URLSearchParams(searchParams.toString());

        // Always delete existing params with this key first to avoid duplicates
        params.delete(key);

        if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
            // If the value exists and is not empty, add/update the parameter
            if (Array.isArray(value)) {
                // For arrays (multiple select), join with comma into a single param
                const filteredValue = value.filter(value => options?.find(option => option.value === value));
                params.set(key, filteredValue.join(','));
            } else {
                if (options?.find(option => option.value === value)) {
                    params.set(key, value);
                }
            }
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <>
            {label && (
                <Label required={required} className="text-matte-black dark:text-snow-white">
                    {label}
                </Label>
            )}
            <AntdSelect
                options={options}
                className={cn('w-full', className)}
                value={currentValue}
                size={size}
                showSearch={true}
                optionFilterProp="label"
                placeholder={placeholder || 'Selecione uma opção'}
                mode={multiple ? 'tags' : undefined}
                {...props}
                onChange={(value: string | string[]) => {
                    if (paramKey) {
                        if (Array.isArray(value)) {
                            const filteredValue = value.filter(value =>
                                options?.find(option => option.value === value),
                            );

                            onChange?.(filteredValue);
                        }
                        if (typeof value === 'string' && options?.find(option => option.value === value)) {
                            onChange?.(value);
                        }
                    } else {
                        onChange?.(value);
                    }

                    if (changeUrl && (paramKey || props.name)) {
                        handleFilterChange(paramKey || props.name || '', value);
                    }
                }}
            />
        </>
    );
}
