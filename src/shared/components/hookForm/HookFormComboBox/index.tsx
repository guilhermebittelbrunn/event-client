import { Combobox, ComboboxProps } from '@/shared/components/form/combobox';
import { SelectProps } from 'antd';
import { Control, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';

interface HookFormComboBoxProps<T extends FieldValues> extends ComboboxProps {
    control: Control<T>;
    name: Path<T>;
    label: string;
    options: SelectProps['options'];
    controllerProps?: Omit<ControllerProps<T>, 'name' | 'control' | 'render'>;
}

export function HookFormComboBox<T extends FieldValues>({
    control,
    name,
    options,
    label,
    controllerProps,
    ...props
}: HookFormComboBoxProps<T>): React.ReactElement {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => <Combobox {...field} options={options} placeholder={label} {...props} />}
            {...controllerProps}
        />
    );
}
