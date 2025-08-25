import Link from 'next/link';
import { Button, ButtonProps } from '../button';

export interface LinkButtonProps extends ButtonProps {
    href: string;
}

export function LinkButton({ children, className, size = 'middle', type, href, ...props }: LinkButtonProps) {
    return (
        <Link href={href}>
            <Button size={size} type={type} className={className} {...props}>
                {children}
            </Button>
        </Link>
    );
}
