import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Label } from '../label';

export interface SelectProps extends Omit<AntdSelectProps, 'mode'> {
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

    // For multiple mode, split comma-separated values, otherwise get single value
    const currentValue = paramKey
        ? multiple
            ? (() => {
                  const value = searchParams.get(paramKey);
                  return value ? value.split(',') : undefined;
              })()
            : searchParams.get(paramKey)
        : undefined;

    const handleFilterChange = (key: string, value: string | string[] | null) => {
        const params = new URLSearchParams(searchParams.toString());

        // Always delete existing params with this key first to avoid duplicates
        params.delete(key);

        if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
            // If the value exists and is not empty, add/update the parameter
            if (Array.isArray(value)) {
                // For arrays (multiple select), join with comma into a single param
                params.set(key, value.join(','));
            } else {
                params.set(key, value);
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
                placeholder={placeholder || 'Selecione uma opção'}
                mode={multiple ? 'tags' : undefined}
                {...props}
                onChange={value => {
                    if (changeUrl && (paramKey || props.name)) {
                        handleFilterChange(paramKey || props.name || '', value);
                    }
                    onChange?.(value);
                }}
            />
        </>
    );
}
