import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';
import { RangePicker } from '../../form';
import { RangePickerProps } from '../../form/rangePicker';

interface HookFormRangePickerProps<T extends FieldValues> extends RangePickerProps {
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

                // Ensure the value is the correct type for RangePicker
                let rangeValue: [Date, Date] | null = null;
                if (Array.isArray(field.value) && field.value.length === 2) {
                    rangeValue = field.value as unknown as [Date, Date];
                }

                return (
                    <RangePicker
                        {...field}
                        onChange={field.onChange}
                        value={rangeValue as any}
                        error={error}
                        {...props}
                    />
                );
            }}
            {...controllerProps}
        />
    );
}
