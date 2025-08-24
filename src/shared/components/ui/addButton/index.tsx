import { PlusOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from '../button';

interface AddButtonProps extends ButtonProps {
    onClick?: () => void;
}

export function AddButton({ onClick, ...props }: AddButtonProps) {
    return <Button icon={<PlusOutlined />} onClick={() => onClick?.()} {...props} />;
}
