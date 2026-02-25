import { DatePicker } from '@/shared/components/form/datePicker';
import { DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormDatePickerProps<T extends FieldValues> extends DatePickerProps {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

function toDayjs(value: unknown): Dayjs | null {
    if (value == null) return null;
    if (dayjs.isDayjs(value) && value.isValid()) return value;
    const parsed = dayjs(value as string | Date);
    return parsed.isValid() ? parsed : null;
}

function fromDayjs(value: Dayjs | null): string | null {
    return value?.isValid() ? value.toISOString() : null;
}

export function HookFormDatePicker<T extends FieldValues>({
    control,
    name,
    label,
    controllerProps,
    ...props
}: HookFormDatePickerProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const { error } = fieldState;
                const value = toDayjs(field.value);

                return (
                    <DatePicker
                        label={label}
                        {...field}
                        value={value}
                        placeholder={label}
                        onChange={date => field.onChange(fromDayjs(date))}
                        error={error}
                        {...props}
                    />
                );
            }}
            {...controllerProps}
        />
    );
}
