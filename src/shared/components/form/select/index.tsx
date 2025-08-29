import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Label } from '../label';

export interface SelectProps extends AntdSelectProps {
    name: string;
    changeUrl?: boolean;
    label?: string;
    required?: boolean;
    id?: string;
    placeholder?: string;
}

export function Select({
    options,
    className,
    changeUrl = false,
    onChange,
    label,
    required,
    placeholder,
    size = 'large',
    ...props
}: SelectProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentStatus = searchParams.get('status') || undefined;

    const handleFilterChange = (key: string, value: string | string[] | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
            // If the value exists and is not empty, add/update the parameter
            if (Array.isArray(value)) {
                // For arrays (multiple select), add each value
                value.forEach((v) => params.append(key, v));
            } else {
                params.set(key, value);
            }
        } else {
            // If the value is null, undefined, empty, or an empty array, remove the parameter
            params.delete(key);
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <>
            {label && <Label required={required}>{label}</Label>}
            <AntdSelect
                options={options}
                className={cn('', className)}
                value={currentStatus}
                size={size}
                placeholder={placeholder || 'Selecione uma opção'}
                {...props}
                onChange={(value) => {
                    if (changeUrl) {
                        handleFilterChange(props.name, value);
                    }
                    onChange?.(value);
                }}
            />
        </>
    );
}
