import { cn } from '@/shared/utils/helpers/cn';
import { Switch as AntdSwitch, SwitchProps as AntdSwitchProps } from 'antd';
import { Label } from '../label';
import { Tooltip } from '../../ui';

export interface SwitchProps extends AntdSwitchProps {
    label: string;
    helperText?: string;
}

export function Switch({ label, helperText, ...props }: SwitchProps) {
    return (
        <div className="flex items-center gap-2">
            <Tooltip title={helperText} className="flex gap-2">
                <Label className="text-matte-black dark:text-snow-white">{label}</Label>
                <AntdSwitch className={cn('', props.className)} {...props} />
            </Tooltip>
        </div>
    );
}
