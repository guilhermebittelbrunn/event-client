import { cn } from '@/shared/utils/helpers/cn';
import { Switch as AntdSwitch, SwitchProps as AntdSwitchProps } from 'antd';

export interface SwitchProps extends AntdSwitchProps {
    label?: string;
}

export function Switch({ label, ...props }: SwitchProps) {
    return (
        <div className="flex items-center gap-2">
            {label && <label htmlFor={props.id}>{label}</label>}
            <AntdSwitch className={cn('', props.className)} {...props} />
        </div>
    );
}
