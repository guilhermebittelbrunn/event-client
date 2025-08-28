import { DatePickerProps } from 'antd';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';
import { RangePicker } from '../../form';

interface HookFormRangePickerProps<T extends FieldValues> extends DatePickerProps {
    control?: Control<T>;
    name: Path<T>;
    label?: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

export function HookFormRangePicker<T extends FieldValues>({
    control,
    name,
    label,
    controllerProps,
    ...props
}: HookFormRangePickerProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const { error } = fieldState;

                return (
                    <RangePicker
                        {...field}
                        placeholder={label}
                        onChange={field.onChange}
                        error={error}
                        {...props}
                    />
                );
            }}
            {...controllerProps}
        />
    );
}
