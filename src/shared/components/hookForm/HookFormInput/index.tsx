import { Input } from '@/shared/components/form';
import { InputProps } from 'antd';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormInputProps<T extends FieldValues> extends InputProps {
    control: Control<T>;
    name: Path<T>;
    label: string;
    type: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

export function HookFormInput<T extends FieldValues>({
    control,
    name,
    label,
    type,
    controllerProps,
    ...props
}: HookFormInputProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => <Input {...field} placeholder={label} type={type} {...props} />}
            {...controllerProps}
        />
    );
}
