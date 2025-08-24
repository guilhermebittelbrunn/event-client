import { Select, SelectProps } from '@/shared/components/form';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormSelectProps<T extends FieldValues> extends SelectProps {
    control: Control<T>;
    name: Path<T>;
    label: string;
    options: SelectProps['options'];
    placeholder?: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

export function HookFormSelect<T extends FieldValues>({
    control,
    name,
    label,
    controllerProps,
    ...props
}: HookFormSelectProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => <Select {...field} changeUrl={false} placeholder={label} {...props} />}
            {...controllerProps}
        />
    );
}
