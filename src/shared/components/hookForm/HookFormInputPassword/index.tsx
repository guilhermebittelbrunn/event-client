import { InputPassword } from '@/shared/components/form';
import { InputProps } from 'antd';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormInputPasswordProps<T extends FieldValues> extends InputProps {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

export function HookFormInputPassword<T extends FieldValues>({
    control,
    name,
    label,
    controllerProps,
    ...props
}: HookFormInputPasswordProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => <InputPassword {...field} label={label} placeholder={label} {...props} />}
            {...controllerProps}
        />
    );
}
