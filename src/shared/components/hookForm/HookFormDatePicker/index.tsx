import { DatePicker } from '@/shared/components/form/datePicker';
import { DatePickerProps } from 'antd';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormDatePickerProps<T extends FieldValues> extends DatePickerProps {
    control: Control<T>;
    name: Path<T>;
    label: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
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
            render={({ field }) => (
                <DatePicker {...field} placeholder={label} onChange={field.onChange} {...props} />
            )}
            {...controllerProps}
        />
    );
}
