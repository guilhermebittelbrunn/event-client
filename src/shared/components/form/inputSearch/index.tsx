import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { useRouter, useSearchParams } from 'next/navigation';

type Trigger = 'onChange' | 'onSearch';

export interface InputSearchProps extends Omit<AntdInputProps, 'onChange' | 'onSearch'> {
    name?: string;
    changeUrl?: boolean;
    onSearch?: (value: string) => void;
    onChange?: (value: string) => void;
    trigger?: Trigger[];
}

export function InputSearch({
    name,
    changeUrl = false,
    className,
    onSearch,
    onChange,
    trigger = ['onSearch'],
    ...props
}: InputSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChangeUrl = (value: string) => {
        const key = name || 'term';
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        if (trigger.includes('onSearch')) {
            if (changeUrl) {
                handleChangeUrl(value);
            }
            onSearch?.(value);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (trigger.includes('onChange')) {
            if (changeUrl) {
                handleChangeUrl(e.target.value);
            }
            onChange?.(e.target.value);
        }
    };

    return (
        <AntdInput.Search
            className={cn('', className)}
            size="large"
            enterButton
            onSearch={handleSearch}
            onChange={handleChange}
            {...props}
        />
    );
}
