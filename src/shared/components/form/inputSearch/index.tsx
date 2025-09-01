import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { useRouter, useSearchParams } from 'next/navigation';

type Trigger = 'onChange' | 'onSearch';

export interface InputSearchProps extends Omit<AntdInputProps, 'onChange' | 'onSearch'> {
    name?: string;
    changeUrl?: boolean;
    paramKey?: string;
    onSearch?: (value: string) => void;
    onChange?: (value: string) => void;
    trigger?: Trigger[];
}

export function InputSearch({
    name,
    changeUrl = false,
    paramKey = 'term',
    className,
    onSearch,
    onChange,
    trigger = ['onSearch'],
    ...props
}: InputSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultValue = searchParams.get(paramKey) || '';

    const handleChangeUrl = (value: string) => {
        const key = name || paramKey;
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
            className={cn(
                `
                rounded-lg border appearance-none border-gray-200 dark:bg-matte-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800
                dark:border-gray-700 `,
                className,
            )}
            size="large"
            enterButton
            onSearch={handleSearch}
            onChange={handleChange}
            defaultValue={defaultValue}
            {...props}
        />
    );
}
