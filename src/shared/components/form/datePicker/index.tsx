import { DatePicker as AntdDatePicker, DatePickerProps as AntdDatePickerProps } from 'antd';
import { cn } from '@/shared/utils/cn';

export type DatePickerProps = AntdDatePickerProps;

export function DatePicker({ onChange, className, ...props }: DatePickerProps) {
    return <AntdDatePicker onChange={onChange} className={cn('', className)} {...props} />;
}
