import { InputSearch, InputSearchProps } from '@/shared/components/form/inputSearch';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormInputSearchProps<T extends FieldValues> extends InputSearchProps {
    control: Control<T>;
    name: Path<T>;
    label: string;
    type: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

export function HookFormInputSearch<T extends FieldValues>({
    control,
    name,
    label,
    ...props
}: HookFormInputSearchProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => <InputSearch {...field} placeholder={label} {...props} />}
            {...props.controllerProps}
        />
    );
}
