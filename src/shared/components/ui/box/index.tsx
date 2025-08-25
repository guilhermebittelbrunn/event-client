import { cn } from '@/shared/utils/cn';
import { Flex } from 'antd';

interface BoxProps {
    children: React.ReactNode;
    type?: 'primary' | 'secondary';
    className?: string;
}

const boxTypes = {
    primary: 'bg-soft-gold dark:bg-soft-gold-dark',
    secondary: 'bg-champagne dark:bg-champagne-dark',
};

export function Box({ children, type, className }: BoxProps) {
    return (
        <Flex
            vertical={false}
            justify="center"
            className={cn(
                'flex flex-col w-full',
                type ? boxTypes[type] : 'bg-gray-50 dark:bg-matte-black',
                className,
            )}
        >
            {children}
        </Flex>
    );
}
