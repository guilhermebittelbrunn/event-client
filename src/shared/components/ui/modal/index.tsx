import { cn } from '@/shared/utils/helpers/cn';
import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import { Button } from '../button';

export interface ModalProps extends Omit<AntdModalProps, 'type'> {
    children?: React.ReactNode;
    className?: string;
    size?: 'large' | 'middle' | 'small';
    type?: 'primary' | 'secondary';
    open?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onToggle?: () => void;
}

export function Modal({
    children,
    className,
    open,
    onClose,
    onConfirm,
    cancelText,
    okText,
    ...props
}: ModalProps) {
    return (
        <AntdModal className={cn('', className)} open={open} onCancel={onClose} {...props} footer={false}>
            <div className="flex flex-col p-10 justify-center items-center">{children}</div>
            <div className="flex justify-end gap-2">
                <Button type="secondary" onClick={onClose} className="px-6">
                    {cancelText ? cancelText : 'Fechar'}
                </Button>
                <Button type="primary" onClick={onConfirm}>
                    {okText ? okText : 'Confirmar'}
                </Button>
            </div>
        </AntdModal>
    );
}
