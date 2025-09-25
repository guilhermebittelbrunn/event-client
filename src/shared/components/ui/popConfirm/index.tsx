import { cn } from '@/shared/utils';
import { Popconfirm as AntdPopconfirm, PopconfirmProps as AntdPopconfirmProps } from 'antd';

export interface PopConfirmProps extends AntdPopconfirmProps {
    children: React.ReactNode;
}

export function PopConfirm({ children, className, ...props }: PopConfirmProps) {
    return (
        <AntdPopconfirm {...props} okText="Confirmar" className={cn('', className)}>
            {children}
        </AntdPopconfirm>
    );
}
