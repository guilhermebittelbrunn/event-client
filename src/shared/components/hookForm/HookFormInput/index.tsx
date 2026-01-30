import { Input } from '@/shared/components/form';
import { InputProps } from 'antd';
import { ChangeEvent } from 'react';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormInputProps<T extends FieldValues> extends InputProps {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    type?: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function HookFormInput<T extends FieldValues>({
    control,
    name,
    label,
    type = 'text',
    controllerProps,
    onChange,
    ...props
}: HookFormInputProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                    <Input
                        {...field}
                        label={label}
                        placeholder={label}
                        type={type}
                        error={error}
                        onChange={e => {
                            field.onChange(e);
                            onChange?.(e);
                        }}
                        {...props}
                    />
                );
            }}
            {...controllerProps}
        />
    );
}
