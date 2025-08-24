import { cn } from '@/shared/utils/cn';

interface BoxProps {
    children: React.ReactNode;
    primary?: boolean;
    className?: string;
}

export function Box({ children, primary = false, className }: BoxProps) {
    return (
        <div
            className={cn(
                'flex flex-col',
                primary ? 'bg-brand-500 dark:bg-brand-900' : 'bg-gray-50 dark:bg-gray-800',
                className,
            )}
        >
            {children}
        </div>
    );
}
