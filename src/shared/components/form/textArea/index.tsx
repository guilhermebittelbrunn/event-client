import { Input } from 'antd';
import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input';
import { cn } from '@/shared/utils/cn';

const { TextArea: AntdTextArea } = Input;

export type TextAreaProps = AntdTextAreaProps;

export function TextArea({ className, ...props }: TextAreaProps) {
    return <AntdTextArea size="large" className={cn('', className)} {...props} />;
}
