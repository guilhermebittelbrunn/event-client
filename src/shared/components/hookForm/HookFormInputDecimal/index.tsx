import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';
import { InputDecimal, InputDecimalProps } from '@/shared/components/form';

interface HookFormInputDecimalProps<T extends FieldValues> extends InputDecimalProps {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
    onChange?: (value: number | string | null) => void;
}

export function HookFormInputDecimal<T extends FieldValues>({
    control,
    name,
    label,
    controllerProps,
    onChange,
    ...props
}: HookFormInputDecimalProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                    <InputDecimal
                        {...field}
                        label={label}
                        placeholder={label}
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
