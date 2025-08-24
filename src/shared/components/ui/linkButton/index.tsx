import { ButtonProps as AntdButtonProps } from 'antd';
import { ButtonType } from 'antd/es/button';
import Link from 'next/link';
import { Button } from '../button';

export interface LinkButtonProps extends AntdButtonProps {
    href: string;
    children?: React.ReactNode;
    className?: string;
    size?: 'large' | 'middle' | 'small';
    type?: ButtonType;
}

export function LinkButton({
    children,
    className,
    size = 'middle',
    type = 'primary',
    href,
    ...props
}: LinkButtonProps) {
    return (
        <Link href={href}>
            <Button size={size} type={type} className={className} {...props}>
                {children}
            </Button>
        </Link>
    );
}
