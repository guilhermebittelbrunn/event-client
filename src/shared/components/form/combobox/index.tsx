import { Select, SelectProps } from 'antd';
import { cn } from '@/shared/utils/cn';

export interface ComboboxProps extends SelectProps {
    options: SelectProps['options'];
    onChange?: (value: string[]) => void;
    label?: string;
}

export function Combobox({ options, onChange, className, label, ...props }: ComboboxProps) {
    const handleChange = (value: string[]) => {
        const selectedOption = !!options?.find((option) => value.includes(option.value as string));
        if (selectedOption) {
            onChange?.(value);
        }
    };

    return (
        <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={label}
            options={options}
            onChange={handleChange}
            size="large"
            className={cn('', className)}
            allowClear
            showSearch
            {...props}
        />
    );
}
