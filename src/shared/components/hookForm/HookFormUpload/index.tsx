import { InputUpload, InputUploadProps } from '@/shared/components/form/inputUpload';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormUploadProps<T extends FieldValues> extends InputUploadProps {
    control?: Control<T>;
    name: Path<T>;
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
    label?: string;
}

export function HookFormUpload<T extends FieldValues>({
    control,
    name,
    label,
    ...props
}: HookFormUploadProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const { error } = fieldState;
                return <InputUpload {...field} {...props} error={error} label={label} value={field.value} />;
            }}
            {...props.controllerProps}
        />
    );
}
