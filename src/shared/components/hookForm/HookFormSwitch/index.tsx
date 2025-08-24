import { Switch, SwitchProps } from '@/shared/components/form/switch';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormSwitchProps<T extends FieldValues> extends SwitchProps {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

export function HookFormSwitch<T extends FieldValues>({
    control,
    name,
    label,
    controllerProps,
    ...props
}: HookFormSwitchProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => <Switch {...field} onChange={field.onChange} label={label} {...props} />}
            {...controllerProps}
        />
    );
}
