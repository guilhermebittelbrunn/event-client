import { TextArea, TextAreaProps } from '@/shared/components/form';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormTextAreaProps<T extends FieldValues> extends TextAreaProps {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

export function HookFormTextArea<T extends FieldValues>({
    control,
    name,
    label,
    controllerProps,
    ...props
}: HookFormTextAreaProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const { error } = fieldState;
                return <TextArea {...field} placeholder={label} {...props} error={error} label={label} />;
            }}
            {...controllerProps}
        />
    );
}
